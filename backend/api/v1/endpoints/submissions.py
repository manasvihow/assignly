from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from ....db.database import get_session
from ....db.models import Submission, User
from ....core.security import get_current_student
from ....api.v1.schemas.assignment_schemas import SubmissionRead

router = APIRouter()

@router.get("/me", response_model=List[SubmissionRead])
def get_my_submissions(
    *,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_student),
):
    """
    Get all submissions for the currently logged-in student.
    """
    return current_user.submissions