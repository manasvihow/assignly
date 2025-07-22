from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel


class UserRead(SQLModel):
    """Schema for user data included in other responses."""
    id: int
    username: str

class AssignmentRead(SQLModel):
    """Read schema for a single assignment."""
    id: int
    title: str
    description: str
    deadline: datetime
    attachment_url: Optional[str] = None
    owner: UserRead

class SubmissionRead(SQLModel):
    """Read schema for a student submission."""
    id: int
    submitted_at: datetime
    attachment_url: Optional[str] = None
    student: UserRead 
    assignment_id: int