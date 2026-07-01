from pydantic import BaseModel, Field, field_validator, model_validator


class Submission(BaseModel):
    sequence: str = Field(..., min_length=23, max_length=23)
    target_sequence: str | None = Field(default=None, min_length=23, max_length=23)
    dna_sequence: str | None = Field(default=None, min_length=23, max_length=20000)
    max_mismatches: int = Field(default=6, ge=0, le=20)
    species: str = "hg38"
    nuclease: str = "Cas9"
    threshold: str = "10%"
    model_name: str = "K562"

    @field_validator("sequence", "target_sequence")
    @classmethod
    def normalize_pair_sequence(cls, value: str | None) -> str | None:
        if value is None:
            return value
        cleaned = value.strip().upper().replace("U", "T")
        allowed = set("ATGC")
        if any(base not in allowed for base in cleaned):
            raise ValueError("La séquence doit contenir uniquement A, T/U, G ou C.")
        return cleaned

    @field_validator("dna_sequence")
    @classmethod
    def normalize_dna_sequence(cls, value: str | None) -> str | None:
        if value is None or not value.strip():
            return None
        cleaned = value.strip().upper().replace("U", "T")
        allowed = set("ATGCN")
        if any(base not in allowed for base in cleaned):
            raise ValueError("La région ADN doit contenir uniquement A, T/U, G, C ou N.")
        return cleaned

    @model_validator(mode="after")
    def require_target_or_dna(self):
        if not self.target_sequence and not self.dna_sequence:
            raise ValueError("Fournis une séquence cible ou une région ADN à scanner.")
        return self


class InterpretedBase(BaseModel):
    char: str
    risk: str
    attention: float


class OffTargetSite(BaseModel):
    locus: str
    mismatches: int
    score: float
    gene_type: str


class AnalysisResult(BaseModel):
    global_score: int
    risk_level: str
    interpreted_sequence: list[InterpretedBase]
    off_targets: list[OffTargetSite]


class RegisterRequest(BaseModel):
    siret: str = Field(..., min_length=14, max_length=14)
    company_name: str = Field(..., min_length=2, max_length=120)
    email: str = Field(..., min_length=5, max_length=120)
    password: str = Field(..., min_length=1, max_length=120)

    @field_validator("siret")
    @classmethod
    def normalize_siret(cls, value: str) -> str:
        cleaned = "".join(char for char in value if char.isdigit())
        if len(cleaned) != 14:
            raise ValueError("Le SIRET doit contenir 14 chiffres.")
        return cleaned

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        cleaned = value.strip().lower()
        if "@" not in cleaned or "." not in cleaned.split("@")[-1]:
            raise ValueError("Adresse email invalide.")
        return cleaned


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=120)
    password: str = Field(..., min_length=1, max_length=120)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class UserOut(BaseModel):
    id: int
    email: str
    company_name: str
    siret: str


class AuthResponse(BaseModel):
    token: str
    user: UserOut


class HistoryCreate(BaseModel):
    sequence: str
    target_sequence: str | None = None
    dna_sequence: str | None = None
    score: int
    risk_level: str


class HistoryItem(BaseModel):
    id: int
    created_at: str
    sequence: str
    target_sequence: str | None
    dna_sequence: str | None
    score: int
    risk_level: str


class CompanyOut(BaseModel):
    siret: str
    company_name: str
