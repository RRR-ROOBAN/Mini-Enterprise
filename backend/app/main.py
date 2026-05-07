from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import comment_model
from app.routers.dashboard_router import router as dashboard_router

# ✅ Import ALL models
from app.models import user_model, task_model, approval_model, approval_history_model

# ✅ Import routers correctly
from app.routers.auth_router import router as auth_router
from app.routers.task_router import router as task_router
from app.routers.approval_router import router as approval_router
from app.routers.comment_router import router as comment_router


app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create tables
Base.metadata.create_all(bind=engine)

# ✅ Include routers
app.include_router(auth_router)
app.include_router(task_router)
app.include_router(approval_router)
app.include_router(comment_router)
app.include_router(dashboard_router)


@app.get("/")
def home():
    return {"message": "API is running"}