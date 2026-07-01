from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import ALLOWED_ORIGINS, API_TITLE, LOCAL_ORIGIN_REGEX
from app.db import (
    add_history,
    create_session,
    create_user,
    delete_session,
    get_user_by_email,
    get_user_by_token,
    init_db,
    list_demo_companies,
    list_history,
    verify_password,
)
from app.schemas import (
    AnalysisResult,
    AuthResponse,
    CompanyOut,
    HistoryItem,
    LoginRequest,
    RegisterRequest,
    Submission,
    UserOut,
)
from app.services.ai_service import analyze_submission


app = FastAPI(title=API_TITLE)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=LOCAL_ORIGIN_REGEX,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup() -> None:
    init_db()


def serialize_user(user) -> UserOut:
    return UserOut(
        id=user["id"],
        email=user["email"],
        company_name=user["company_name"],
        siret=user["siret"],
    )


def get_bearer_token(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentification requise.")
    return authorization.removeprefix("Bearer ").strip()


def get_current_user(token: str = Depends(get_bearer_token)):
    user = get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Session invalide.")
    return user


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "service": API_TITLE}


@app.get("/companies", response_model=list[CompanyOut])
async def companies() -> list[CompanyOut]:
    return [CompanyOut(**dict(row)) for row in list_demo_companies()]


@app.post("/auth/register", response_model=AuthResponse)
async def register(data: RegisterRequest) -> AuthResponse:
    if get_user_by_email(data.email):
        raise HTTPException(status_code=409, detail="Un compte existe déjà avec cet email.")

    user = create_user(data.email, data.password, data.company_name, data.siret)
    token = create_session(user["id"])
    return AuthResponse(token=token, user=serialize_user(user))


@app.post("/auth/login", response_model=AuthResponse)
async def login(data: LoginRequest) -> AuthResponse:
    user = get_user_by_email(data.email)
    if not user or not verify_password(user, data.password):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect.")

    token = create_session(user["id"])
    return AuthResponse(token=token, user=serialize_user(user))


@app.get("/auth/me", response_model=UserOut)
async def me(user=Depends(get_current_user)) -> UserOut:
    return serialize_user(user)


@app.post("/auth/logout")
async def logout(token: str = Depends(get_bearer_token)) -> dict:
    delete_session(token)
    return {"status": "ok"}


@app.get("/history", response_model=list[HistoryItem])
async def history(user=Depends(get_current_user)) -> list[HistoryItem]:
    return [HistoryItem(**dict(row)) for row in list_history(user["id"])]


@app.post("/analyze", response_model=AnalysisResult)
async def analyze_sequence(data: Submission, user=Depends(get_current_user)) -> AnalysisResult:
    try:
        result = analyze_submission(data)
        add_history(
            user_id=user["id"],
            sequence=data.sequence,
            target_sequence=data.target_sequence,
            dna_sequence=data.dna_sequence,
            score=result.global_score,
            risk_level=result.risk_level,
        )
        return result
    except ModuleNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Dépendance IA manquante: {exc.name}. Installe l'environnement IA backend.",
        ) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
