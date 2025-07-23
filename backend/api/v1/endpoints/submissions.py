from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session

from ....db.database import get_session
from ....core.security import get_current_student
from ....db.models import User
from ....api.v1.schemas.assignment_schemas import SubmissionRead

router = APIRouter()

@router.get("/me", response_model=List[SubmissionRead])
def get_my_submissions(
    *,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_student),
):
    return current_user.submissions
