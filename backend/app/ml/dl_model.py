"""
X-CRISP-XAI — Modèle Deep Learning de prédiction du risque off-target
======================================================================

CONTENU DE CE MODULE (livrable "modèle DL" pour le reste de l'équipe)
--------------------------------------------------------------------
1. ENCODEURS        : transforment (guide, cible) -> matrice (L, 7)
                      - mismatch  : 23x7 directionnel  (datasets K562 / Hek293t)
                      - indel     : 24x7 gap-aware      (datasets CIRCLE / GUIDE-seq)
2. CHARGEMENT DATA  : build_dataset_mismatch / build_dataset_indel
                      -> X, y, groups (groups = guide, pour un split sans fuite)
3. MODELE           : OffTargetNet = CNN + BiLSTM + attention
                      -> renvoie (logits, poids_attention)   <- utile pour le XAI
4. ENTRAINEMENT     : train_model(...)  avec
                      - split PAR GUIDE (GroupKFold)
                      - sous-échantillonnage 20:1 des négatifs (TRAIN uniquement)
                      - métrique principale = AUPRC (forte classe déséquilibrée)
5. INFERENCE        : load_model(...) + predict(...) / predict_with_attention(...)
                      -> API simple pour le membre "inférence" et le membre "XAI"

Ce module ne fait QUE le modèle DL. Il ne contient ni l'API web, ni le
module SHAP, ni l'interface : ces parties sont laissées aux autres membres,
qui s'appuient sur les fonctions exposées ci-dessous.

Dépendances : numpy, pandas, scikit-learn, torch
"""

from __future__ import annotations

from pathlib import Path
from typing import Iterable

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.model_selection import GroupKFold
from torch.utils.data import DataLoader, TensorDataset

# ---------------------------------------------------------------------------
# Reproductibilité
# ---------------------------------------------------------------------------
SEED = 42
np.random.seed(SEED)
torch.manual_seed(SEED)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# ===========================================================================
# 1. ENCODEURS
# ===========================================================================
# Convention : on encode une PAIRE (guide, cible). Le guide est la séquence
# de référence (sgRNA / on-target), la cible est la séquence ADN testée
# (off-target potentiel). Les deux encodeurs sortent une matrice (L, 7) afin
# que le MEME réseau accepte les deux familles.

_ONE_HOT4 = {"A": [1, 0, 0, 0], "T": [0, 1, 0, 0],
             "G": [0, 0, 1, 0], "C": [0, 0, 0, 1]}

# --- 1a. Encodeur MISMATCH (23x7) -----------------------------------------
# Identique à feature_extraction.py : OU binaire (4) + direction (2) + PAM (1)
SEQ_LEN_MM = 23
_ORDER_MM = {"A": 1, "G": 2, "C": 3, "T": 4}  # ordre fixe pour coder la direction


def encode_mismatch(guide: str, target: str) -> np.ndarray:
    """Encodage 23x7 (mismatch-only). Colonnes :
    [0:4] OU binaire des deux nucléotides (2 bits allumés = mismatch)
    [4:6] direction du mismatch (guide>cible vs guide<cible)
    [6]   1 si la position est dans le PAM (3 derniers nt), sinon 0
    """
    guide, target = guide.upper(), target.upper()
    m = np.zeros((SEQ_LEN_MM, 7), dtype=np.float32)
    for i in range(SEQ_LEN_MM):
        g, t = guide[i], target[i]
        m[i, 0:4] = np.bitwise_or(np.array(_ONE_HOT4[g]), np.array(_ONE_HOT4[t]))
        if g != t:
            if _ORDER_MM[g] > _ORDER_MM[t]:
                m[i, 4] = 1.0
            else:
                m[i, 5] = 1.0
        if i >= SEQ_LEN_MM - 3:          # PAM = positions 21-23
            m[i, 6] = 1.0
    return m


# --- 1b. Encodeur INDEL (24x7, gap-aware) ----------------------------------
# Les séquences CIRCLE-seq / GUIDE-seq sont alignées sur 24 nt et peuvent
# contenir un symbole de gap "_" (insertion/délétion). On encode donc 5
# canaux {A,T,G,C,_} au lieu de 4, + 2 canaux de direction.
SEQ_LEN_INDEL = 24
_ONE_HOT5 = {"A": [1, 0, 0, 0, 0], "T": [0, 1, 0, 0, 0],
             "G": [0, 0, 1, 0, 0], "C": [0, 0, 0, 1, 0],
             "_": [0, 0, 0, 0, 1]}
# Le gap reçoit la priorité de direction la plus BASSE : ainsi une position
# avec gap est codée distinctement d'un simple appariement.
_ORDER_INDEL = {"_": 0, "A": 1, "G": 2, "C": 3, "T": 4}


def encode_indel(guide: str, target: str) -> np.ndarray:
    """Encodage 24x7 (indel, gap-aware). Colonnes :
    [0:5] OU binaire sur {A,T,G,C,_}  (2 bits allumés = différence)
    [5:7] direction de la différence (priorité gap = la plus basse)
    """
    # les datasets utilisent indifféremment '-' et '_' comme symbole de gap
    guide = guide.upper().replace("-", "_")
    target = target.upper().replace("-", "_")
    m = np.zeros((SEQ_LEN_INDEL, 7), dtype=np.float32)
    for i in range(SEQ_LEN_INDEL):
        g, t = guide[i], target[i]
        m[i, 0:5] = np.bitwise_or(np.array(_ONE_HOT5[g]), np.array(_ONE_HOT5[t]))
        if g != t:
            if _ORDER_INDEL[g] > _ORDER_INDEL[t]:
                m[i, 5] = 1.0
            else:
                m[i, 6] = 1.0
    return m


# ===========================================================================
# 2. CHARGEMENT DES DATASETS
# ===========================================================================
# Chaque loader renvoie (X, y, groups) :
#   X      : np.ndarray (N, L, 7)  matrices encodées
#   y      : np.ndarray (N,)       labels 0/1
#   groups : np.ndarray (N,)       identité du guide (pour le split SANS FUITE)

def build_dataset_mismatch(csv_path: str | Path) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Datasets mismatch-only : colonnes on_seq, off_seq, label (23 nt)."""
    df = pd.read_csv(csv_path)
    df = df[(df["on_seq"].str.len() == SEQ_LEN_MM) &
            (df["off_seq"].str.len() == SEQ_LEN_MM)].reset_index(drop=True)
    X = np.stack([encode_mismatch(r.on_seq, r.off_seq) for r in df.itertuples()])
    y = df["label"].astype(int).to_numpy()
    groups = df["on_seq"].to_numpy()          # le guide = la séquence on-target
    return X, y, groups


def build_dataset_indel(csv_path: str | Path) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Datasets indel : CIRCLE-seq (sgRNA_seq/off_seq/sgRNA_type) ou
    GUIDE-seq (crRNA/DNA). Détection automatique des colonnes.
    """
    df = pd.read_csv(csv_path)
    cols = set(df.columns)
    if {"sgRNA_seq", "off_seq"} <= cols:          # CIRCLE-seq
        guide_col, target_col = "sgRNA_seq", "off_seq"
        group_col = "sgRNA_type" if "sgRNA_type" in cols else "sgRNA_seq"
    elif {"crRNA", "DNA"} <= cols:                 # GUIDE-seq
        guide_col, target_col = "crRNA", "DNA"
        group_col = "crRNA"
    else:
        raise ValueError(f"Colonnes indel non reconnues : {sorted(cols)}")

    df = df[(df[guide_col].str.len() == SEQ_LEN_INDEL) &
            (df[target_col].str.len() == SEQ_LEN_INDEL)].reset_index(drop=True)
    X = np.stack([encode_indel(g, t)
                  for g, t in zip(df[guide_col], df[target_col])])
    y = df["label"].astype(float).round().astype(int).to_numpy()
    # le groupe = guide sans les gaps (un même guide aligné différemment
    # doit rester dans le même fold) ; '-' et '_' sont tous deux des gaps
    groups = (df[group_col].astype(str)
              .str.replace("-", "", regex=False)
              .str.replace("_", "", regex=False).to_numpy())
    return X, y, groups


# ===========================================================================
# 3. MODELE : CNN + BiLSTM + Attention
# ===========================================================================

class OffTargetNet(nn.Module):
    """Réseau de prédiction off-target.

    Pipeline :
      entrée (B, L, 7)
        -> Conv1d (motifs locaux de mismatch/gap)
        -> BiLSTM (dépendances le long de la séquence)
        -> Attention additive (pondère les positions importantes)
        -> couche dense -> 1 logit

    forward() renvoie (logits, attention) :
      - logits     : (B,)        score brut, passer par sigmoid pour la proba
      - attention  : (B, L)      poids par position, sommant à 1
                     >>> C'EST CE VECTEUR QUE LE MODULE XAI UTILISE pour
                     expliquer quelles positions ont guidé la prédiction.
    """

    def __init__(self, in_channels: int = 7, conv_channels: int = 64,
                 lstm_hidden: int = 64, dropout: float = 0.3):
        super().__init__()
        # --- bloc convolutionnel (sur l'axe des positions) ---
        self.conv = nn.Sequential(
            nn.Conv1d(in_channels, conv_channels, kernel_size=3, padding=1),
            nn.BatchNorm1d(conv_channels),
            nn.ReLU(),
            nn.Conv1d(conv_channels, conv_channels, kernel_size=3, padding=1),
            nn.BatchNorm1d(conv_channels),
            nn.ReLU(),
            nn.Dropout(dropout),
        )
        # --- BiLSTM ---
        self.lstm = nn.LSTM(conv_channels, lstm_hidden, batch_first=True,
                            bidirectional=True)
        lstm_out = lstm_hidden * 2
        # --- attention additive ---
        self.attn = nn.Linear(lstm_out, 1)
        # --- tête de classification ---
        self.head = nn.Sequential(
            nn.Linear(lstm_out, 64), nn.ReLU(), nn.Dropout(dropout),
            nn.Linear(64, 1),
        )

    def forward(self, x: torch.Tensor):
        # x : (B, L, 7) -> conv attend (B, C, L)
        h = self.conv(x.transpose(1, 2)).transpose(1, 2)   # (B, L, conv_channels)
        h, _ = self.lstm(h)                                 # (B, L, 2*hidden)
        scores = self.attn(h).squeeze(-1)                   # (B, L)
        weights = torch.softmax(scores, dim=1)              # (B, L) somme=1
        context = torch.sum(weights.unsqueeze(-1) * h, dim=1)  # (B, 2*hidden)
        logits = self.head(context).squeeze(-1)             # (B,)
        return logits, weights


# ===========================================================================
# 4. ENTRAINEMENT
# ===========================================================================

def _undersample_train(y: np.ndarray, ratio: int = 20, rng=None) -> np.ndarray:
    """Indices d'un sous-échantillon TRAIN : tous les positifs + ratio*positifs
    négatifs tirés au hasard. N'est JAMAIS appliqué au set de validation."""
    rng = rng or np.random.default_rng(SEED)
    pos = np.where(y == 1)[0]
    neg = np.where(y == 0)[0]
    n_neg = min(len(neg), ratio * max(len(pos), 1))
    neg_sample = rng.choice(neg, size=n_neg, replace=False)
    idx = np.concatenate([pos, neg_sample])
    rng.shuffle(idx)
    return idx


def _make_loader(X, y, idx, batch_size, shuffle):
    ds = TensorDataset(torch.from_numpy(X[idx]).float(),
                       torch.from_numpy(y[idx]).float())
    return DataLoader(ds, batch_size=batch_size, shuffle=shuffle)


@torch.no_grad()
def _evaluate(model, loader) -> dict:
    model.eval()
    probs, trues = [], []
    for xb, yb in loader:
        logits, _ = model(xb.to(DEVICE))
        probs.append(torch.sigmoid(logits).cpu().numpy())
        trues.append(yb.numpy())
    probs = np.concatenate(probs)
    trues = np.concatenate(trues)
    out = {"auprc": float(average_precision_score(trues, probs))}
    try:
        out["auroc"] = float(roc_auc_score(trues, probs))
    except ValueError:
        out["auroc"] = float("nan")     # arrive si un fold n'a pas de positif
    return out


def train_model(X, y, groups, *, n_splits: int = 5, epochs: int = 15,
                batch_size: int = 256, lr: float = 1e-3, undersample_ratio: int = 20,
                save_path: str | Path | None = None, verbose: bool = True) -> dict:
    """Entraîne le modèle en validation croisée PAR GUIDE.

    - split        : GroupKFold(groups) -> aucun guide partagé train/val
    - train        : sous-échantillonné 20:1 (négatifs) -> classes gérables
    - validation   : COMPLETE et déséquilibrée -> métriques honnêtes
    - métrique     : AUPRC (+ AUROC indicatif)

    Réentraîne un modèle final sur tout le dataset (sous-échantillonné) si
    save_path est fourni, et l'enregistre pour l'inférence.

    Retourne un dict de résultats (AUPRC par fold + moyenne).
    """
    seq_len, in_ch = X.shape[1], X.shape[2]
    n_groups = len(np.unique(groups))
    n_splits = min(n_splits, n_groups)
    gkf = GroupKFold(n_splits=n_splits)
    rng = np.random.default_rng(SEED)

    fold_metrics = []
    for fold, (tr, va) in enumerate(gkf.split(X, y, groups), start=1):
        tr_sub = tr[_undersample_train(y[tr], undersample_ratio, rng)]
        model = OffTargetNet(in_channels=in_ch).to(DEVICE)
        opt = torch.optim.Adam(model.parameters(), lr=lr)
        # pos_weight léger : il reste ~20 négatifs pour 1 positif après undersample
        loss_fn = nn.BCEWithLogitsLoss(
            pos_weight=torch.tensor(float(undersample_ratio), device=DEVICE))

        tr_loader = _make_loader(X, y, tr_sub, batch_size, shuffle=True)
        va_loader = _make_loader(X, y, va, batch_size, shuffle=False)

        for ep in range(epochs):
            model.train()
            for xb, yb in tr_loader:
                opt.zero_grad()
                logits, _ = model(xb.to(DEVICE))
                loss = loss_fn(logits, yb.to(DEVICE))
                loss.backward()
                opt.step()

        m = _evaluate(model, va_loader)
        fold_metrics.append(m)
        if verbose:
            print(f"  Fold {fold}/{n_splits} | val guides={len(np.unique(groups[va]))} "
                  f"| AUPRC={m['auprc']:.4f} | AUROC={m['auroc']:.4f}")

    auprc = np.array([m["auprc"] for m in fold_metrics])
    results = {"auprc_mean": float(auprc.mean()), "auprc_std": float(auprc.std()),
               "folds": fold_metrics}
    if verbose:
        print(f"  >>> AUPRC moyen = {results['auprc_mean']:.4f} "
              f"± {results['auprc_std']:.4f}")

    # --- modèle final entraîné sur tout (pour l'inférence) ---
    if save_path is not None:
        all_idx = _undersample_train(y, undersample_ratio, rng)
        model = OffTargetNet(in_channels=in_ch).to(DEVICE)
        opt = torch.optim.Adam(model.parameters(), lr=lr)
        loss_fn = nn.BCEWithLogitsLoss(
            pos_weight=torch.tensor(float(undersample_ratio), device=DEVICE))
        loader = _make_loader(X, y, all_idx, batch_size, shuffle=True)
        for ep in range(epochs):
            model.train()
            for xb, yb in loader:
                opt.zero_grad()
                logits, _ = model(xb.to(DEVICE))
                loss_fn(logits, yb.to(DEVICE)).backward()
                opt.step()
        save_path = Path(save_path)
        save_path.parent.mkdir(parents=True, exist_ok=True)
        torch.save({"state_dict": model.state_dict(),
                    "in_channels": in_ch, "seq_len": seq_len}, save_path)
        if verbose:
            print(f"  Modèle final enregistré -> {save_path}")
    return results


# ===========================================================================
# 5. INFERENCE  (API pour les membres "inférence" et "XAI")
# ===========================================================================

def load_model(model_path: str | Path) -> OffTargetNet:
    """Recharge un modèle entraîné depuis un .pt."""
    ckpt = torch.load(model_path, map_location=DEVICE)
    model = OffTargetNet(in_channels=ckpt["in_channels"]).to(DEVICE)
    model.load_state_dict(ckpt["state_dict"])
    model.eval()
    return model


def _encode_pair(guide: str, target: str, mode: str) -> np.ndarray:
    if mode == "mismatch":
        return encode_mismatch(guide, target)
    elif mode == "indel":
        return encode_indel(guide, target)
    raise ValueError("mode doit être 'mismatch' ou 'indel'")


@torch.no_grad()
def predict(model: OffTargetNet, guide: str, target: str,
            mode: str = "mismatch") -> float:
    """Probabilité d'off-target actif pour UNE paire (guide, cible).
    >>> C'est la fonction d'inférence simple à brancher derrière l'API web.
    """
    x = torch.from_numpy(_encode_pair(guide, target, mode)).float().unsqueeze(0)
    logit, _ = model(x.to(DEVICE))
    return float(torch.sigmoid(logit).item())


@torch.no_grad()
def predict_with_attention(model: OffTargetNet, guide: str, target: str,
                           mode: str = "mismatch") -> dict:
    """Comme predict(), mais renvoie aussi le vecteur d'attention par position.
    >>> C'est l'entrée principale pour le membre XAI (poids d'attention =
        importance par nucléotide, à mettre en regard de SHAP).
    Retour : {'prob': float, 'attention': list[float] de longueur L}
    """
    x = torch.from_numpy(_encode_pair(guide, target, mode)).float().unsqueeze(0)
    logit, attn = model(x.to(DEVICE))
    return {"prob": float(torch.sigmoid(logit).item()),
            "attention": attn.squeeze(0).cpu().numpy().tolist()}


# ===========================================================================
# 6. SCRIPT : entraîne tous les datasets disponibles
# ===========================================================================
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Entraînement X-CRISP-XAI DL")
    parser.add_argument("--data_dir", default="data", help="dossier des CSV")
    parser.add_argument("--out_dir", default="models", help="dossier de sortie")
    parser.add_argument("--epochs", type=int, default=15)
    args = parser.parse_args()

    data_dir, out_dir = Path(args.data_dir), Path(args.out_dir)
    print(f"Device : {DEVICE}\n")

    jobs = [
        ("mismatch", "Hek293t.csv",     build_dataset_mismatch),
        ("mismatch", "K562.csv",        build_dataset_mismatch),
        ("mismatch", "K562Hek293.csv",  build_dataset_mismatch),
        ("indel",    "CIRCLE_seq.csv",  build_dataset_indel),
        ("indel",    "GUIDE-Seq.csv",   build_dataset_indel),
    ]

    for mode, fname, loader in jobs:
        path = data_dir / fname
        if not path.exists():
            print(f"[!] introuvable : {path}")
            continue
        print(f"=== {fname} ({mode}) ===")
        X, y, groups = loader(path)
        print(f"  {len(X)} paires | {y.sum()} positifs "
              f"({100 * y.mean():.3f}%) | {len(np.unique(groups))} guides")
        save = out_dir / f"{path.stem}_{mode}.pt"
        train_model(X, y, groups, epochs=args.epochs, save_path=save)
        print()
