from sqlalchemy import (
    create_engine
)

from sqlalchemy.orm import (
    sessionmaker,
    declarative_base
)

import redis


DATABASE_URL = (
    "mysql+pymysql://root:5253@localhost:3306/stackly_test"
)


# ✅ MySQL Engine
engine = create_engine(

    DATABASE_URL,

    pool_pre_ping=True,

    pool_recycle=3600
)


SessionLocal = sessionmaker(

    bind=engine,

    autoflush=False,

    autocommit=False
)


Base = declarative_base()


# ✅ Redis Client
redis_client = redis.Redis(

    host="localhost",

    port=6379,

    db=0,

    decode_responses=True
)


# ✅ Database Dependency
def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()