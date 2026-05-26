from fastapi import (
    APIRouter,
    Depends,
    Body,
    Request
)

from fastapi.responses import (
    RedirectResponse
)

from sqlalchemy.orm import Session

from authlib.integrations.base_client.errors import (
    MismatchingStateError
)

from app.database import get_db

from app.schemas.user_schema import (
    UserCreate,
    UserLogin
)

from app.services.auth_service import (

    register_service,

    login_service,

    get_current_user,

    refresh_access_token,

    forgot_password_service,

    reset_password_service,

    oauth,

    google_login_service
)

from app.core.limiter import limiter


router = APIRouter(

    prefix="/auth",

    tags=["Auth"]
)


# ✅ Register
@router.post("/register")
@limiter.limit("5/minute")

def register(

    request: Request,

    user: UserCreate,

    db: Session = Depends(get_db)

):

    return register_service(
        user,
        db
    )


# ✅ Login
@router.post("/login")
@limiter.limit("10/minute")

def login(

    request: Request,

    user: UserLogin,

    db: Session = Depends(get_db)

):

    return login_service(
        user,
        db
    )


# ✅ Refresh Token
@router.post("/refresh")
@limiter.limit("20/minute")

def refresh_token(

    request: Request,

    refresh_token: str = Body(
        ...,
        embed=True
    )

):

    return refresh_access_token(
        refresh_token
    )


# ✅ Forgot Password
@router.post("/forgot-password")
@limiter.limit("5/minute")

def forgot_password(

    request: Request,

    email: str = Body(
        ...,
        embed=True
    ),

    db: Session = Depends(get_db)

):

    return forgot_password_service(
        email,
        db
    )


# ✅ Reset Password
@router.post("/reset-password")
@limiter.limit("5/minute")

def reset_password(

    request: Request,

    token: str = Body(...),

    new_password: str = Body(...),

    db: Session = Depends(get_db)

):

    return reset_password_service(

        token,

        new_password,

        db
    )


# ✅ Google Login
@router.get("/google/login")

async def google_login(

    request: Request

):

    redirect_uri=(

        "http://127.0.0.1:8000"

        "/auth/google/callback"

    )

    return await oauth.google.authorize_redirect(

        request,

        redirect_uri,

        prompt="consent select_account"

    )


# ✅ Google Callback
@router.get(
    "/google/callback"
)

async def google_callback(

    request: Request,

    db: Session = Depends(
        get_db
    )

):

    try:

        token = await oauth.google.authorize_access_token(
            request
        )

    except MismatchingStateError:

        return RedirectResponse(
            "http://localhost:3000"
        )

    user_info = token.get(
        "userinfo"
    )

    jwt_data = google_login_service(

        user_info["email"],

        user_info["name"],

        db
    )

    frontend_url = (

        "http://localhost:3000"

        "/oauth-success"

        f"?access_token={jwt_data['access_token']}"

        f"&refresh_token={jwt_data['refresh_token']}"

        f"&role={jwt_data['role']}"
    )

    return RedirectResponse(

        url=frontend_url,

        status_code=302

    )


# ✅ Current User
@router.get("/me")
@limiter.limit("30/minute")

def get_me(

    request: Request,

    current_user = Depends(
        get_current_user
    )

):

    return current_user