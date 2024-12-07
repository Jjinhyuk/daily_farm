from typing import Optional, Dict, Any
from httpx_oauth.clients.google import GoogleOAuth2
from httpx_oauth.clients.kakao import KakaoOAuth2
from app.core.config import settings

google_oauth_client = GoogleOAuth2(
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
)

kakao_oauth_client = KakaoOAuth2(
    client_id=settings.KAKAO_CLIENT_ID,
    client_secret=settings.KAKAO_CLIENT_SECRET,
)

async def get_google_user_info(access_token: str) -> Dict[str, Any]:
    async with google_oauth_client.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    ) as response:
        return await response.json()

async def get_kakao_user_info(access_token: str) -> Dict[str, Any]:
    async with kakao_oauth_client.get(
        "https://kapi.kakao.com/v2/user/me",
        headers={"Authorization": f"Bearer {access_token}"},
    ) as response:
        return await response.json() 