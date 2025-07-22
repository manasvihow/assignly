from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from ....db.database import get_session
from ....db.models import User, UserRole
from ....core.security import hash_password, verify_password, create_access_token
from ....core.config import settings
from sqlmodel import SQLModel

from ....core.security import get_current_user
from ....db.models import User

# --- API Schemas ---

class UserCreate(SQLModel):
    """Schema for user creation (input)."""
    username: str
    password: str
    role: UserRole

class UserRead(SQLModel):
    """Schema for reading user data (output)."""
    id: int
    username: str
    role: UserRole

class Token(SQLModel):
    """Schema for the access token response."""
    access_token: str
    token_type: str = "bearer"


# --- API Router ---

router = APIRouter()

@router.post("/users/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(*, session: Session = Depends(get_session), user_in: UserCreate):

    # Check if a user with that username already exists
    existing_user = session.exec(select(User).where(User.username == user_in.username)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    # Hash the password before storing
    hashed_pwd = hash_password(user_in.password)

    # Create a new User object from the input schema
    new_user = User.model_validate(user_in, update={'hashed_password': hashed_pwd})
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user

@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    session: Session = Depends(get_session)
):
    """
    Authenticate user and return an access token.
    """
    # 1. Find user by username
    user = session.exec(select(User).where(User.username == form_data.username)).first()

    # 2. Check if user exists and if the password is correct
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Create the access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role.value}, 
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Fetch the profile of the currently logged-in user.
    """
    return current_user