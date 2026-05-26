from fastapi import (

    FastAPI,

    WebSocket,

    WebSocketDisconnect

)

from fastapi.middleware.cors import (
    CORSMiddleware
)

from starlette.middleware.sessions import (
    SessionMiddleware
)

from slowapi.middleware import (
    SlowAPIMiddleware
)

from app.core.limiter import (
    limiter
)

from app.database import (
    engine,
    Base
)

from app.websocket_manager import (
    manager
)

import asyncio


# ✅ Models
from app.models import (

    user_model,

    task_model,

    approval_model,

    approval_history_model,

    comment_model,

    audit_log_model,

    notification_model,

    document_model,

    password_reset_model,

    activity_model,

    organization_model,

    subscription_model,

    billing_model

)


# ✅ Routers
from app.routers.auth_router import (
    router as auth_router
)

from app.routers.task_router import (
    router as task_router
)

from app.routers.approval_router import (
    router as approval_router
)

from app.routers.comment_router import (
    router as comment_router
)

from app.routers.dashboard_router import (
    router as dashboard_router
)

from app.routers.audit_router import (
    router as audit_router
)

from app.routers.notification_router import (
    router as notification_router
)

from app.routers.document_router import (
    router as document_router
)

from app.routers.activity_router import (
    router as activity_router
)

from app.routers.ai_router import (
    router as ai_router
)

from app.routers import (
    organization_router
)

from app.routers.subscription_router import (

router as subscription_router

)

from app.routers.billing_router import (

router as billing_router

)


app = FastAPI()


# ✅ Session
app.add_middleware(

    SessionMiddleware,

    secret_key="STACKLY_SECRET_KEY"

)


# ✅ Rate Limit
app.state.limiter=limiter

app.add_middleware(

    SlowAPIMiddleware

)


# ✅ CORS
app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)


# ✅ Tables
Base.metadata.create_all(

    bind=engine

)


# ✅ Routers
app.include_router(

    auth_router

)

app.include_router(

    task_router

)

app.include_router(

    approval_router

)

app.include_router(

    comment_router

)

app.include_router(

    dashboard_router

)

app.include_router(

    audit_router

)

app.include_router(

    notification_router

)

app.include_router(

    document_router

)

app.include_router(

    activity_router

)

app.include_router(

    ai_router

)

app.include_router(

    organization_router.router

)

app.include_router(

subscription_router

)

from app.routers.credit_router import (

router as credit_router

)

app.include_router(

credit_router

)

app.include_router(

billing_router

)

# 🔥 Notification websocket
@app.websocket(

    "/ws/notifications/{user_id}"

)

async def notification_socket(

    websocket:WebSocket,

    user_id:int

):

    await manager.connect(

        websocket,

        user_id

    )

    try:

        while True:

            await websocket.receive_text()

    except(

        WebSocketDisconnect,

        asyncio.CancelledError

    ):

        manager.disconnect(

            websocket,

            user_id

        )


# 🔥 Kanban websocket
@app.websocket(

    "/ws/kanban"

)

async def kanban_socket(

    websocket:WebSocket

):

    await manager.connect_kanban(

        websocket

    )

    try:

        while True:

            await websocket.receive_text()

    except(

        WebSocketDisconnect,

        asyncio.CancelledError

    ):

        manager.disconnect_kanban(

            websocket

        )


@app.get("/")

def home():

    return{

        "message":

        "API is running"

    }