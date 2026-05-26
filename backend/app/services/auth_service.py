from passlib.context import CryptContext

from dotenv import load_dotenv
from os import getenv

from jose import (
    jwt,
    JWTError
)

from datetime import (
    datetime,
    timedelta
)

from fastapi import (
    Depends,
    HTTPException
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from sqlalchemy import select

from authlib.integrations.starlette_client import OAuth

from os import getenv

import secrets

from app.database import SessionLocal

from app.models.user_model import User

from app.models.password_reset_model import (
    PasswordResetToken
)

from app.models.organization_model import (

Organization

)

SECRET_KEY = "RRR123"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

REFRESH_TOKEN_EXPIRE_DAYS = 7


pwd_context = CryptContext(

    schemes=["bcrypt"],

    deprecated="auto"
)

security = HTTPBearer()


# GOOGLE OAUTH
load_dotenv()

print("CLIENT_ID =", getenv("GOOGLE_CLIENT_ID"))
print("SECRET =", getenv("GOOGLE_CLIENT_SECRET"))
oauth = OAuth()



oauth.register(

    name="google",

    client_id=getenv(
        "GOOGLE_CLIENT_ID"
    ),

    client_secret=getenv(
        "GOOGLE_CLIENT_SECRET"
    ),

    server_metadata_url=

    "https://accounts.google.com/.well-known/openid-configuration",

    client_kwargs={

        "scope":

        "openid email profile"

    }
)


# HASH
def hash_password(
    password:str
):

    return pwd_context.hash(
        password
    )


# VERIFY
def verify_password(

    plain_password,

    hashed_password

):

    return pwd_context.verify(

        plain_password,

        hashed_password
    )


# ACCESS TOKEN
def create_access_token(
    data:dict
):

    to_encode = data.copy()

    expire = datetime.utcnow(

    ) + timedelta(

        minutes=
        ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({

        "exp":expire,

        "type":"access"

    })

    return jwt.encode(

        to_encode,

        SECRET_KEY,

        algorithm=ALGORITHM
    )


# REFRESH TOKEN
def create_refresh_token(
    data:dict
):

    to_encode = data.copy()

    expire = datetime.utcnow(

    ) + timedelta(

        days=
        REFRESH_TOKEN_EXPIRE_DAYS
    )

    to_encode.update({

        "exp":expire,

        "type":"refresh"

    })

    return jwt.encode(

        to_encode,

        SECRET_KEY,

        algorithm=ALGORITHM
    )


# REGISTER
def register_service(

    user,

    db

):

    existing=db.execute(

        select(User).where(

            User.email==user.email

        )

    ).scalars().first()


    if existing:

        raise HTTPException(

            status_code=400,

            detail="Email exists"

        )


    organization=db.execute(

        select(

            Organization

        ).where(

            Organization.name

            ==

            "Stackly"

        )

    ).scalars().first()


    if not organization:

        organization=Organization(

            name="Stackly"

        )

        db.add(

            organization

        )

        db.commit()

        db.refresh(

            organization

        )


    new_user=User(

        name=user.name,

        email=user.email,

        hashed_password=

        hash_password(

            user.password

        ),

        role=user.role,

        organization_id=

        organization.id

    )


    db.add(

        new_user

    )

    db.commit()

    db.refresh(

        new_user

    )


    return{

        "message":

        "User registered"

    }

# LOGIN
def login_service(
    user,
    db
):

    db_user = db.execute(

        select(User).where(

            User.email == user.email

        )

    ).scalars().first()

    if (

        not db_user

        or

        not verify_password(

            user.password,

            db_user.hashed_password
        )

    ):

        raise HTTPException(

            status_code=401,

            detail="Invalid credentials"
        )

    return {

        "access_token":

        create_access_token({

            "sub":
            db_user.email

        }),

        "refresh_token":

        create_refresh_token({

            "sub":
            db_user.email

        }),

        "role":

        db_user.role
    }


   # GOOGLE LOGIN
def google_login_service(

    email,

    name,

    db

):

    user=db.execute(

        select(User).where(

            User.email==email

        )

    ).scalars().first()


    if not user:


        organization=db.execute(

            select(

                Organization

            ).where(

                Organization.name

                ==

                "Stackly"

            )

        ).scalars().first()


        if not organization:

            organization=Organization(

                name="Stackly"

            )

            db.add(

                organization

            )

            db.commit()

            db.refresh(

                organization

            )


        user=User(

            name=name,

            email=email,

            hashed_password=

            "GOOGLE_LOGIN",

            role="employee",

            organization_id=

            organization.id

        )


        db.add(

            user

        )

        db.commit()

        db.refresh(

            user

        )


    return{

        "access_token":

        create_access_token({

            "sub":

            user.email

        }),

        "refresh_token":

        create_refresh_token({

            "sub":

            user.email

        }),

        "role":

        user.role

    }

# REFRESH
def refresh_access_token(
    refresh_token
):

    try:

        payload = jwt.decode(

            refresh_token,

            SECRET_KEY,

            algorithms=[ALGORITHM]

        )

        if (

            payload.get("type")

            !=

            "refresh"

        ):

            raise HTTPException(

                status_code=401,

                detail="Invalid token"

            )

        return {

            "access_token":

            create_access_token({

                "sub":

                payload["sub"]

            })

        }

    except JWTError:

        raise HTTPException(

            status_code=401,

            detail="Invalid token"

        )


# FORGOT PASSWORD
def forgot_password_service(
    email,
    db
):

    user = db.execute(

        select(User).where(

            User.email==email

        )

    ).scalars().first()

    if not user:

        raise HTTPException(

        status_code=401,

        detail="Invalid email or password"

    )

    token = secrets.token_urlsafe(32)

    expiry = datetime.utcnow(

    ) + timedelta(

        minutes=10

    )

    reset = PasswordResetToken(

        user_id=user.id,

        token=token,

        expires_at=expiry
    )

    db.add(reset)

    db.commit()

    return {

        "reset_token":

        token
    }


# RESET PASSWORD
def reset_password_service(

    token,

    new_password,

    db

):

    reset = db.execute(

        select(

            PasswordResetToken

        ).where(

            PasswordResetToken.token

            ==

            token

        )

    ).scalars().first()

    if not reset:

        raise HTTPException(

            status_code=400,

            detail="Invalid token"
        )

    if reset.is_used:

        raise HTTPException(

            status_code=400,

            detail="Already used"
        )

    if reset.expires_at < datetime.utcnow():

        raise HTTPException(

            status_code=400,

            detail="Expired token"
        )

    user = db.execute(

        select(User).where(

            User.id

            ==

            reset.user_id

        )

    ).scalars().first()

    user.hashed_password = hash_password(

        new_password
    )

    reset.is_used = True

    db.commit()

    return {

        "message":

        "Password updated"
    }


# CURRENT USER
def get_current_user(

credentials:

HTTPAuthorizationCredentials

=

Depends(security)

):

    token = credentials.credentials

    try:

        payload = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=[ALGORITHM]
        )

        email = payload.get(

            "sub"
        )

    except:

        raise HTTPException(

            status_code=401,

            detail="Invalid token"
        )

    db = SessionLocal()

    user = db.execute(

        select(User).where(

            User.email == email

        )

    ).scalars().first()

    db.close()

    return user