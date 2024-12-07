from datetime import datetime, timedelta
from typing import Optional

from jose import jwt

from app.core.config import settings
from app.core.security import ALGORITHM

password_reset_jwt_subject = "preset"

def generate_password_reset_token(email: str) -> str:
    delta = timedelta(hours=24)
    now = datetime.utcnow()
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {
            "exp": exp,
            "nbf": now.timestamp(),
            "sub": password_reset_jwt_subject,
            "email": email,
        },
        settings.SECRET_KEY,
        algorithm=ALGORITHM,
    )
    return encoded_jwt

def verify_password_reset_token(token: str) -> Optional[str]:
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        assert decoded_token["sub"] == password_reset_jwt_subject
        return decoded_token["email"]
    except (jwt.JWTError, AssertionError):
        return None 