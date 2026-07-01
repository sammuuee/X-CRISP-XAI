"""
X-CRISP-XAI — Étape 2 : génération des candidats off-target
============================================================

OBJECTIF
--------
Partir d'UN guide seul -> ressortir la liste des sites d'une séquence ADN qui
lui ressemblent (les "candidats off-target"), prêts à être notés par le
modèle DL. C'est le maillon qui manquait entre "l'utilisateur tape un guide"
et "le modèle donne un risque".

PRINCIPE (simple)
-----------------
On glisse une fenêtre de 23 nt le long de l'ADN (sur les 2 brins). A chaque
position suivie d'un PAM "NGG", on compte les différences (mismatches) entre
le guide et la fenêtre. Si c'est en dessous d'un seuil -> c'est un candidat.

PORTEE / LIMITES
----------------
- Version Python autonome : idéale pour une région, un gène, un test, la démo.
- Pour scanner TOUT le génome humain (hg38), utiliser l'outil dédié
  Cas-OFFinder (bien plus rapide) puis passer sa colonne off_seq à predict().
  Le reste de la chaîne (encodage -> modèle) est identique.
- Ici on gère les MISMATCHES uniquement (modèles 23nt). Les candidats avec
  indels (bulges) relèvent du mode "bulge" de Cas-OFFinder + des modèles 24nt.

Dépendances : pandas (+ dl_model pour le scoring de bout en bout)
"""

from __future__ import annotations

import pandas as pd

PROTOSPACER_LEN = 20
SEQ_LEN = 23                      # 20 nt protospacer + 3 nt PAM
_COMPLEMENT = {"A": "T", "T": "A", "G": "C", "C": "G", "N": "N"}


def reverse_complement(seq: str) -> str:
    """Brin complémentaire inversé (pour chercher aussi sur l'autre brin)."""
    return "".join(_COMPLEMENT.get(b, "N") for b in reversed(seq.upper()))


def _pam_ok(triplet: str, pam: str = "NGG") -> bool:
    """Vrai si le triplet respecte le motif PAM (N = n'importe quelle base)."""
    return all(p == "N" or p == b for p, b in zip(pam, triplet))


def find_candidates(guide: str, dna: str, max_mismatches: int = 6,
                    pam: str = "NGG") -> list[dict]:
    """Cherche dans `dna` tous les sites ressemblant au `guide`.

    guide : séquence 23 nt de référence (20 nt protospacer + 3 nt PAM).
    dna   : séquence ADN à scanner (région, gène, chromosome...).
    max_mismatches : nb max de différences tolérées sur le protospacer.

    Retour : liste de dict {off_seq, strand, position, n_mismatches},
             chaque off_seq faisant 23 nt -> directement utilisable par
             encode_mismatch / predict.
    """
    guide = guide.upper()
    spacer = guide[:PROTOSPACER_LEN]
    out = []
    for strand, seq in (("+", dna.upper()), ("-", reverse_complement(dna))):
        for i in range(len(seq) - SEQ_LEN + 1):
            window = seq[i:i + SEQ_LEN]
            if "N" in window:
                continue
            if not _pam_ok(window[PROTOSPACER_LEN:], pam):
                continue
            n_mm = sum(1 for a, b in zip(spacer, window[:PROTOSPACER_LEN]) if a != b)
            if n_mm <= max_mismatches:
                out.append({"off_seq": window, "strand": strand,
                            "position": i, "n_mismatches": n_mm})
    return out


# ---------------------------------------------------------------------------
# Chaîne complète : guide -> candidats -> scores du modèle -> classement
# ---------------------------------------------------------------------------

def screen_guide(guide: str, dna: str, model, *, max_mismatches: int = 6,
                 pam: str = "NGG") -> pd.DataFrame:
    """Bout-en-bout : trouve les candidats ET les note avec le modèle DL.

    `model` : objet renvoyé par dl_model.load_model(".../xxx_mismatch.pt").

    Retour : DataFrame trié du plus risqué au moins risqué, colonnes
             [off_seq, strand, position, n_mismatches, risk].
             `risk` = probabilité d'off-target actif (0 à 1).
    """
    from dl_model import predict          # import local pour éviter un cycle

    cands = find_candidates(guide, dna, max_mismatches, pam)
    for c in cands:
        c["risk"] = predict(model, guide, c["off_seq"], mode="mismatch")
    if not cands:
        return pd.DataFrame(
            columns=["off_seq", "strand", "position", "n_mismatches", "risk"])
    return (pd.DataFrame(cands)
            .sort_values("risk", ascending=False)
            .reset_index(drop=True))


if __name__ == "__main__":
    # Démo minimale : on plante quelques sites ressemblants dans une fausse
    # séquence ADN, puis on déroule la chaîne complète guide -> risques.
    import random
    from dl_model import load_model

    random.seed(0)
    guide = "GAGTCCGAGCAGAAGAAGAAGGG"          # 23 nt (PAM = GGG)

    bases = "ATGC"
    noise = "".join(random.choice(bases) for _ in range(300))
    # on insère : le site parfait + 2 variants (1 et 3 mismatches)
    perfect = guide
    var1 = "GAGTCCGAGCAGAAGAAGAACGG"           # 1 mismatch
    var3 = "GAGTCCGAGCAGTAGAACAATGG"           # ~3 mismatches
    dna = noise[:60] + perfect + noise[60:150] + var1 + noise[150:240] + var3

    model = load_model("models/K562_mismatch.pt")
    df = screen_guide(guide, dna, model, max_mismatches=6)
    print(f"{len(df)} candidats trouvés\n")
    print(df.to_string(index=False))
