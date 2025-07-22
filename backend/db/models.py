import enum
from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


# Define an enum for the user roles for data consistency
class UserRole(str, enum.Enum):
    teacher = "teacher"
    student = "student"


# The User model for the 'users' table
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str
    role: UserRole

    assignments: List["Assignment"] = Relationship(back_populates="owner")
    submissions: List["Submission"] = Relationship(back_populates="student")


# The Assignment model for the 'assignments' table
class Assignment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    deadline: datetime
    attachment_url: Optional[str] = None

    # Foreign key
    teacher_id: int = Field(foreign_key="user.id")

    owner: User = Relationship(back_populates="assignments")
    submissions: List["Submission"] = Relationship(back_populates="assignment")


# The Submission model for the 'submissions' table
class Submission(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    submitted_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    attachment_url: Optional[str] = None

    # Foreign keys
    assignment_id: int = Field(foreign_key="assignment.id")
    student_id: int = Field(foreign_key="user.id")

    assignment: Assignment = Relationship(back_populates="submissions")
    student: User = Relationship(back_populates="submissions")