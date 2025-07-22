import shutil
from datetime import datetime
from pathlib import Path
from typing import Optional, List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlmodel import Session, select

from ....db.database import get_session
from ....db.models import Assignment, User
from ....core.security import get_current_teacher


from ....core.security import get_current_user 
from ..schemas.assignment_schemas import AssignmentRead

from ....core.security import get_current_student
from ....db.models import Submission 
from ..schemas.assignment_schemas import SubmissionRead



# --- API Router ---
router = APIRouter()

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
    """
    Create a new assignment. (Teachers only)
    """
    attachment_url = None
    if attachment:
        # Define the path to save the file
        upload_dir = Path("uploads")
        upload_dir.mkdir(exist_ok=True) # Create the directory if it doesn't exist
        file_path = upload_dir / attachment.filename
        
        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(attachment.file, buffer)
        
        # Store the relative path to be accessed by the frontend
        attachment_url = str(file_path)

    # Create the assignment object
    assignment_data = {
        "title": title,
        "description": description,
        "deadline": deadline,
        "teacher_id": current_user.id,
        "attachment_url": attachment_url,
    }
    new_assignment = Assignment.model_validate(assignment_data)
    
    session.add(new_assignment)
    session.commit()
    session.refresh(new_assignment)
    
    return new_assignment

@router.get("/", response_model=List[AssignmentRead])
def list_assignments(
    *,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    List all assignments. (All logged-in users)
    """
    assignments = session.exec(select(Assignment)).all()
    return assignments


@router.post("/{assignment_id}/submit", response_model=SubmissionRead)
def submit_assignment(
    *,
    assignment_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_student),
    attachment: UploadFile = File(...),
):
    """
    Submit work for an assignment. (Students only)
    """
    # 1. Check if the assignment exists
    assignment = session.get(Assignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # 2. Check if the student has already submitted for this assignment
    existing_submission = session.exec(
        select(Submission).where(
            Submission.assignment_id == assignment_id,
            Submission.student_id == current_user.id
        )
    ).first()
    if existing_submission:
        raise HTTPException(status_code=400, detail="You have already submitted for this assignment")

    # 3. Save the submission file
    upload_dir = Path("uploads/submissions")
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / f"{current_user.id}_{attachment.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(attachment.file, buffer)
    
    # 4. Create the submission record in the database
    submission = Submission(
        assignment_id=assignment_id,
        student_id=current_user.id,
        attachment_url=attachment_url_path
    )

    session.add(submission)
    session.commit()
    session.refresh(submission)
    
    return submission

@router.get("/{assignment_id}/submissions", response_model=List[SubmissionRead])
def get_submissions_for_assignment(
    *,
    assignment_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_teacher),
):
    """
    Get all submissions for a specific assignment. (Teacher only)
    """
    # 1. Get the assignment to ensure it exists
    assignment = session.get(Assignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # 2. Check if the current user is the owner of the assignment
    if assignment.teacher_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to view these submissions"
        )

    # 3. Return the assignment's submissions
    return assignment.submissions


@router.get("/{assignment_id}/my-submission", response_model=SubmissionRead)
def get_my_submission_for_assignment(
    *,
    assignment_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_student),
):
    """
    Get the student's own submission for a specific assignment.
    """
    submission = session.exec(
        select(Submission)
        .where(
            Submission.assignment_id == assignment_id,
            Submission.student_id == current_user.id
        )
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    return submission
