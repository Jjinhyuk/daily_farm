from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request

from app import crud, models, schemas
from app.api import deps
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import UserType, AuthProvider
from app.utils import (
    generate_password_reset_token,
    send_reset_password_email,
    verify_password_reset_token,
    oauth
)

router = APIRouter()

oauth = OAuth()
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

oauth.register(
    name='kakao',
    client_id=settings.KAKAO_CLIENT_ID,
    client_secret=settings.KAKAO_CLIENT_SECRET,
    authorize_url='https://kauth.kakao.com/oauth/authorize',
    authorize_params=None,
    token_url='https://kauth.kakao.com/oauth/token',
    client_kwargs={'scope': 'profile_nickname profile_image account_email'}
)

@router.post("/login/access-token", response_model=schemas.Token)
async def login_access_token(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """OAuth2 compatible token login, get an access token for future requests."""
    user = crud.user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=400, detail="Incorrect email or password"
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=400, detail="Inactive user"
        )
    return {
        "access_token": security.create_access_token(user.id),
        "token_type": "bearer",
    }

@router.post("/login/google", response_model=schemas.Token)
async def google_login(
    *,
    db: Session = Depends(deps.get_db),
    access_token: str,
) -> Any:
    """Google OAuth2 login."""
    user_info = await oauth.get_google_user_info(access_token)
    
    if not user_info.get("email"):
        raise HTTPException(
            status_code=400,
            detail="Could not get email from Google"
        )
    
    user = crud.user.get_by_email(db, email=user_info["email"])
    if not user:
        user_in = schemas.UserSocialCreate(
            email=user_info["email"],
            full_name=user_info.get("name"),
            social_id=user_info["sub"],
            auth_provider=AuthProvider.google,
            profile_image=user_info.get("picture")
        )
        user = crud.user.create_social(db, obj_in=user_in)
    
    return {
        "access_token": security.create_access_token(user.id),
        "token_type": "bearer",
    }

@router.post("/login/kakao", response_model=schemas.Token)
async def kakao_login(
    *,
    db: Session = Depends(deps.get_db),
    access_token: str,
) -> Any:
    """Kakao OAuth2 login."""
    user_info = await oauth.get_kakao_user_info(access_token)
    kakao_account = user_info.get("kakao_account", {})
    
    if not kakao_account.get("email"):
        raise HTTPException(
            status_code=400,
            detail="Could not get email from Kakao"
        )
    
    user = crud.user.get_by_email(db, email=kakao_account["email"])
    if not user:
        profile = kakao_account.get("profile", {})
        user_in = schemas.UserSocialCreate(
            email=kakao_account["email"],
            full_name=profile.get("nickname"),
            social_id=str(user_info["id"]),
            auth_provider=AuthProvider.kakao,
            profile_image=profile.get("profile_image_url")
        )
        user = crud.user.create_social(db, obj_in=user_in)
    
    return {
        "access_token": security.create_access_token(user.id),
        "token_type": "bearer",
    }

@router.post("/test-token", response_model=schemas.User)
def test_token(current_user: models.User = Depends(deps.get_current_user)) -> Any:
    """Test access token."""
    return current_user

@router.post("/register", response_model=schemas.User)
def register(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Register new user.
    """
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    # Create user with explicit enum values
    user = models.User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        user_type=UserType.customer,  # Explicitly use enum value
        auth_provider=AuthProvider.local,  # Explicitly use enum value
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=schemas.Token)
def login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }