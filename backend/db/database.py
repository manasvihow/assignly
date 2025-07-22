from sqlmodel import create_engine, Session, SQLModel
# Import the settings instance
from ..core.config import settings

# The DATABASE_URL is now read from the settings object
engine = create_engine(settings.DATABASE_URL, echo=True, connect_args={"check_same_thread": False})

def get_session():
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)