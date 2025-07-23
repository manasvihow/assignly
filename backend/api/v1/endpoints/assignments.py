import shutil
from datetime import datetime
from pathlib import Path
from typing import Optional, List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlmodel import Session, select

from ....db.database import get_session
from ....db.models import Assignment, User, Submission
from ....core.security import get_current_teacher, get_current_user, get_current_student
from ..schemas.assignment_schemas import AssignmentRead, SubmissionRead

router = APIRouter()

# === 1. CREATE ASSIGNMENT ===
@router.post("/", response_model=Assignment, status_code=status.HTTP_201_CREATED)
def create_assignment(
    *,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_teacher),
    title: str = Form(...),
    description: str = Form(...),
    deadline: datetime = Form(...),
    attachment: Optional[UploadFile] = File(None),
):
    attachment_url = None
    if attachment:
        upload_dir = Path("uploads/assignments")
        upload_dir.mkdir(parents=True, exist_ok=True)
        file_path = upload_dir / attachment.filename

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(attachment.file, buffer)

        attachment_url = f"/uploads/assignments/{attachment.filename}"

    new_assignment = Assignment(
        title=title,
        description=description,
        deadline=deadline,
        teacher_id=current_user.id,
        attachment_url=attachment_url
    )

    session.add(new_assignment)
    session.commit()
    session.refresh(new_assignment)
    return new_assignment


# === 2. LIST ASSIGNMENTS ===
@router.get("/", response_model=List[AssignmentRead])
def list_assignments(
    *,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return session.exec(select(Assignment)).all()


# === 3. SUBMIT ASSIGNMENT ===
@router.post("/{assignment_id}/submit", response_model=SubmissionRead)
def submit_assignment(
    *,
    assignment_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_student),
    attachment: UploadFile = File(...)
):
    assignment = session.get(Assignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    existing = session.exec(
        select(Submission).where(
            Submission.assignment_id == assignment_id,
            Submission.student_id == current_user.id
        )
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already submitted")

    upload_dir = Path("uploads/submissions")
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_name = f"{current_user.id}_{attachment.filename}"
    file_path = upload_dir / file_name
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(attachment.file, buffer)

    attachment_url = f"/uploads/submissions/{file_name}"

    submission = Submission(
        assignment_id=assignment_id,
        student_id=current_user.id,
        attachment_url=attachment_url
    )
    session.add(submission)
    session.commit()
    session.refresh(submission)
    return submission


# === 4. GET STUDENT'S SUBMISSION ===
@router.get("/{assignment_id}/my-submission", response_model=SubmissionRead)
def get_my_submission_for_assignment(
    *,
    assignment_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_student),
):
    submission = session.exec(
        select(Submission).where(
            Submission.assignment_id == assignment_id,
            Submission.student_id == current_user.id
        )
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    return submission


# === 5. GET SUBMISSIONS FOR AN ASSIGNMENT ===
@router.get("/{assignment_id}/submissions", response_model=List[SubmissionRead])
def get_submissions_for_assignment(
    *,
    assignment_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_teacher),
):
    assignment = session.get(Assignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if assignment.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return assignment.submissions
