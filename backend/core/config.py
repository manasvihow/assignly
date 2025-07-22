from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Manages application settings and environment variables.
    """
    DATABASE_URL: str = "sqlite:///assignments.db"
    
    # New JWT Settings
    SECRET_KEY: str = "Swordfish"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 # Token will be valid for 30 minutes

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')

settings = Settings()