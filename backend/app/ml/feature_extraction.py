"""
X-CRISP-XAI — Extraction et encodage des features biologiques
================================================================

Objectif : transformer chaque paire (sgRNA, séquence ADN potentiellement
hors-cible) en deux types de représentations complémentaires :

  1. Des MATRICES encodées (pour un modèle deep learning type CNN/RNN)
  2. Des FEATURES SCALAIRES interprétables (pour un modèle tabulaire +
     module XAI type SHAP — c'est cette deuxième partie qui te servira
     directement pour l'explicabilité plus tard)

Convention biologique : chaque séquence fait 23 nt = 20 nt de protospacer
                         + 3 nt de PAM (positions 21-23, format NGG attendu).

Entrée attendue : un CSV avec les colonnes on_seq, off_seq, label
                   (c'est le format des fichiers CRISPR-MCA : K562.csv,
                   Hek293t.csv, etc.)
"""

from pathlib import Path

import numpy as np
import pandas as pd

# Dossier où se trouve CE script (et non le dossier depuis lequel il est
# lancé) — ainsi le script fonctionne identiquement chez tout le monde,
# tant que la structure de dossier "data/" à côté du script est respectée.
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR.parent.parent / "data"
RESULTS_DIR = BASE_DIR.parent.parent / "models"

SEQ_LEN = 23          # 20 nt protospacer + 3 nt PAM
SEED_LEN = 12          # taille de la "région seed" proximale au PAM
                       # (les mismatches y sont biologiquement moins tolérés
                       # — Hsu et al. 2013 ; c'est une feature attendue comme
                       # importante par ton module XAI plus tard)

BASES = ['A', 'T', 'G', 'C']
ONE_HOT = {'A': [1, 0, 0, 0], 'T': [0, 1, 0, 0],
           'G': [0, 0, 1, 0], 'C': [0, 0, 0, 1]}

# Classification purine (A, G) / pyrimidine (T, C) — une substitution
# purine<->purine ou pyrimidine<->pyrimidine ("transition") est en général
# mieux tolérée par Cas9 qu'une substitution croisée ("transversion").
PURINES = {'A', 'G'}


# ---------------------------------------------------------------------------
# 1. Encodage matriciel (pour modèle deep learning)
# ---------------------------------------------------------------------------

def encode_onehot_bitwise(on_seq: str, off_seq: str) -> np.ndarray:
    """Encodage 23x4, schéma 'CNN_std' (Lin & Wong 2018).

    A chaque position, on combine le one-hot du nucléotide du sgRNA et
    celui de la cible par un OU binaire. Une position sans mismatch donne
    un vecteur one-hot classique (ex: [1,0,0,0] pour A=A) ; une position
    avec mismatch donne un vecteur à deux 1 (ex: [1,1,0,0] pour A vs T).
    C'est l'encodage le plus simple et le plus utilisé comme baseline.
    """
    on_seq, off_seq = on_seq.upper(), off_seq.upper()
    matrix = np.zeros((SEQ_LEN, 4), dtype=np.float32)
    for i in range(SEQ_LEN):
        on_code = np.array(ONE_HOT[on_seq[i]])
        off_code = np.array(ONE_HOT[off_seq[i]])
        matrix[i] = np.bitwise_or(on_code, off_code)
    return matrix


def encode_mismatch_directional(on_seq: str, off_seq: str) -> np.ndarray:
    """Encodage 23x7, schéma proche de CRISPR-Net (Lin et al. 2020).

    Plus riche que le précédent : en plus du OU binaire (4 dims), on ajoute
    2 dims encodant la *direction* du mismatch (ex: A->G n'est pas codé
    pareil que G->A) et 1 dim indiquant si la position appartient au PAM.
    C'est cette dimension PAM qui te permettra, plus tard, de vérifier que
    ton module XAI retrouve bien l'importance connue de cette région.
    """
    on_seq, off_seq = on_seq.upper(), off_seq.upper()
    order = {'A': 1, 'G': 2, 'C': 3, 'T': 4}  # ordre arbitraire mais fixe
    matrix = np.zeros((SEQ_LEN, 7), dtype=np.float32)
    for i in range(SEQ_LEN):
        on_b, off_b = on_seq[i], off_seq[i]
        bitwise = np.bitwise_or(np.array(ONE_HOT[on_b]), np.array(ONE_HOT[off_b]))
        direction = np.zeros(2, dtype=np.float32)
        if on_b != off_b:
            if order[on_b] > order[off_b]:
                direction[0] = 1
            else:
                direction[1] = 1
        is_pam = 1.0 if i >= SEQ_LEN - 3 else 0.0
        matrix[i] = np.concatenate([bitwise, direction, [is_pam]])
    return matrix


# ---------------------------------------------------------------------------
# 2. Features biologiques scalaires (pour modèle tabulaire + XAI)
# ---------------------------------------------------------------------------

def gc_content(seq: str) -> float:
    return (seq.count('G') + seq.count('C')) / len(seq)


def extract_bio_features(on_seq: str, off_seq: str) -> dict:
    """Calcule un jeu de features biologiquement interprétables pour une
    paire (sgRNA, cible). Chaque feature a une justification biologique
    directe -- pratique pour relier les résultats SHAP à une explication
    compréhensible par un biologiste.
    """
    on_seq, off_seq = on_seq.upper(), off_seq.upper()

    mismatch_positions = [i for i in range(SEQ_LEN) if on_seq[i] != off_seq[i]]
    n_mismatches = len(mismatch_positions)

    # Mismatches dans le PAM (positions 21-23) vs dans le protospacer
    n_mismatches_pam = sum(1 for p in mismatch_positions if p >= SEQ_LEN - 3)

    # Mismatches dans la région seed (proximale au PAM, hors PAM lui-même)
    seed_start = SEQ_LEN - 3 - SEED_LEN
    n_mismatches_seed = sum(
        1 for p in mismatch_positions if seed_start <= p < SEQ_LEN - 3
    )

    # Distance du mismatch le plus proche du PAM (0 = mismatch adjacent au
    # PAM = généralement le plus délétère pour la liaison Cas9)
    min_dist_to_pam = (
        min(SEQ_LEN - 3 - p for p in mismatch_positions)
        if mismatch_positions else SEQ_LEN
    )

    # Transitions (purine<->purine ou pyrimidine<->pyrimidine) vs
    # transversions (croisées) parmi les mismatches
    n_transitions = sum(
        1 for p in mismatch_positions
        if (on_seq[p] in PURINES) == (off_seq[p] in PURINES)
    )
    n_transversions = n_mismatches - n_transitions

    return {
        'on_seq': on_seq,
        'off_seq': off_seq,
        'pam_off': off_seq[-3:],
        'pam_is_canonical_ngg': off_seq[-2:] == 'GG',
        'n_mismatches': n_mismatches,
        'n_mismatches_pam': n_mismatches_pam,
        'n_mismatches_seed': n_mismatches_seed,
        'min_dist_mismatch_to_pam': min_dist_to_pam,
        'n_transitions': n_transitions,
        'n_transversions': n_transversions,
        'gc_content_on': gc_content(on_seq),
        'gc_content_off': gc_content(off_seq),
        'delta_gc': gc_content(off_seq) - gc_content(on_seq),
    }


# ---------------------------------------------------------------------------
# 3. Pipeline complet pour un fichier CRISPR-MCA (on_seq, off_seq, label)
# ---------------------------------------------------------------------------

def process_dataset(csv_path: str, cell_type: str, save_matrices: bool = False):
    df = pd.read_csv(csv_path)
    df = df[df['on_seq'].str.len() == SEQ_LEN]  # sécurité : on écarte les
    df = df[df['off_seq'].str.len() == SEQ_LEN]  # séquences de longueur atypique

    # --- features scalaires ---
    bio_rows = [extract_bio_features(r.on_seq, r.off_seq) for r in df.itertuples()]
    bio_df = pd.DataFrame(bio_rows)
    bio_df['label'] = df['label'].values
    bio_df['cell_type'] = cell_type

    RESULTS_DIR.mkdir(exist_ok=True)
    out_csv = RESULTS_DIR / f"{cell_type}_bio_features.csv"
    bio_df.to_csv(out_csv, index=False)

    # --- matrices encodées (optionnel, plus volumineux) ---
    if save_matrices:
        mats = np.stack([
            encode_mismatch_directional(r.on_seq, r.off_seq) for r in df.itertuples()
        ])
        labels = df['label'].values
        np.savez_compressed(RESULTS_DIR / f"{cell_type}_encoded.npz", X=mats, y=labels)

    return bio_df


if __name__ == "__main__":
    # Datasets "mismatch-only" (colonnes on_seq/off_seq/label, 23 nt) —
    # compatibles directement avec ce script.
    datasets = {
        "K562": DATA_DIR / "K562.csv",
        "Hek293t": DATA_DIR / "Hek293t.csv",
        # "K562Hek293": DATA_DIR / "K562Hek293.csv",  # décommente si besoin
    }

    for cell_type, path in datasets.items():
        if not path.exists():
            print(f"[!] Fichier introuvable : {path} — vérifie que data/ "
                  f"est bien placé à côté de ce script.")
            continue
        bio_df = process_dataset(str(path), cell_type, save_matrices=True)
        print(f"\n=== {cell_type} ===")
        print(f"{len(bio_df)} paires traitées | "
              f"{bio_df['label'].sum()} off-targets actifs "
              f"({100 * bio_df['label'].mean():.2f}%)")
        print(bio_df.groupby('label')[
            ['n_mismatches', 'n_mismatches_seed', 'min_dist_mismatch_to_pam']
        ].mean().round(2))

    # NB : CIRCLE_seq.csv et GUIDE-Seq.csv (présents dans data/) ne sont PAS
    # traités ici. Leur format est différent (colonnes sgRNA_seq/off_seq ou
    # DNA/crRNA, séquences pouvant contenir des indels et un symbole de gap
    # "_", longueur 24 nt) — ce sont des datasets "indel", pas "mismatch-only".
    # Ils nécessitent un encodeur séparé (cf. Encoder/crispr_net_coding dans
    # CRISPR-MCA/Data/DataEncoding) et ne doivent pas être passés à
    # process_dataset() tel quel, sous peine d'erreurs ou de résultats faux.