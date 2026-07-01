from functools import lru_cache
import sys

from app.config import AI_ML_DIR, DEFAULT_MODEL_PATH
from app.schemas import AnalysisResult, InterpretedBase, OffTargetSite, Submission


def prepare_ai_imports() -> None:
    if str(AI_ML_DIR) not in sys.path:
        sys.path.insert(0, str(AI_ML_DIR))


@lru_cache(maxsize=1)
def get_model():
    if not DEFAULT_MODEL_PATH.exists():
        raise RuntimeError(f"Modèle introuvable: {DEFAULT_MODEL_PATH}")

    prepare_ai_imports()
    from dl_model import load_model

    return load_model(DEFAULT_MODEL_PATH)


def count_mismatches(sequence: str, target_sequence: str) -> int:
    return sum(1 for left, right in zip(sequence, target_sequence) if left != right)


def risk_label(score: int) -> str:
    if score >= 75:
        return "Risque élevé"
    if score >= 50:
        return "Risque moyen"
    if score >= 25:
        return "Risque faible"
    return "Risque très faible"


def risk_bucket(value: float) -> str:
    if value >= 0.75:
        return "high"
    if value >= 0.5:
        return "medium"
    if value >= 0.25:
        return "low"
    return "safe"


def build_interpreted_sequence(guide: str, target_sequence: str) -> list[InterpretedBase]:
    prepare_ai_imports()
    from dl_model import predict_with_attention

    prediction = predict_with_attention(
        get_model(),
        guide,
        target_sequence,
        mode="mismatch",
    )
    attention = [float(value) for value in prediction["attention"]]
    max_attention = max(attention) if attention else 1.0

    return [
        InterpretedBase(
            char=char,
            risk=risk_bucket(value / max_attention if max_attention else 0),
            attention=round(value, 4),
        )
        for char, value in zip(guide, attention)
    ]


def analyze_pair(data: Submission) -> AnalysisResult:
    prepare_ai_imports()
    from dl_model import predict_with_attention

    prediction = predict_with_attention(
        get_model(),
        data.sequence,
        data.target_sequence,
        mode="mismatch",
    )

    probability = float(prediction["prob"])
    score = round(probability * 100)

    return AnalysisResult(
        global_score=score,
        risk_level=risk_label(score),
        interpreted_sequence=build_interpreted_sequence(data.sequence, data.target_sequence),
        off_targets=[
            OffTargetSite(
                locus="Séquence cible fournie",
                mismatches=count_mismatches(data.sequence, data.target_sequence),
                score=round(probability, 4),
                gene_type="Non annoté",
            )
        ],
    )


def analyze_dna_region(data: Submission) -> AnalysisResult:
    prepare_ai_imports()
    from candidate_generation import screen_guide

    candidates = screen_guide(
        data.sequence,
        data.dna_sequence,
        get_model(),
        max_mismatches=data.max_mismatches,
    )

    if candidates.empty:
        return AnalysisResult(
            global_score=0,
            risk_level=risk_label(0),
            interpreted_sequence=[
                InterpretedBase(char=char, risk="safe", attention=0.0)
                for char in data.sequence
            ],
            off_targets=[],
        )

    top = candidates.iloc[0]
    probability = float(top["risk"])
    score = round(probability * 100)

    return AnalysisResult(
        global_score=score,
        risk_level=risk_label(score),
        interpreted_sequence=build_interpreted_sequence(data.sequence, str(top["off_seq"])),
        off_targets=[
            OffTargetSite(
                locus=f"Brin {row.strand}, position {int(row.position)}",
                mismatches=int(row.n_mismatches),
                score=round(float(row.risk), 4),
                gene_type="Candidat PAM NGG",
            )
            for row in candidates.head(10).itertuples(index=False)
        ],
    )


def analyze_submission(data: Submission) -> AnalysisResult:
    if data.dna_sequence:
        return analyze_dna_region(data)
    return analyze_pair(data)
