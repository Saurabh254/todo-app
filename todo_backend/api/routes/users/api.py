from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from fastapi_pagination import Page
from sqlalchemy.orm import Session

from api.auth import auth
from api.database import db

from . import errors, interface, models, schemas

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/login", response_model=schemas.LoginResponse)
def login(data: schemas.LoginUser, db: Session = Depends(db.get_db)):
    if data.phone[-6:] != data.otp:
        raise HTTPException(status_code=401, detail="wrong otp")
    try:
        return interface.user_login(phone=data.phone, db=db)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me", response_model=schemas.User)
def get_me(current_user: Annotated[models.Users, Depends(auth.get_current_user)]):
    return current_user


@router.post(
    "/tasks/create_task",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.Tasks,
)
def create_task(
    current_user: Annotated[models.Users, Depends(auth.get_current_user)],
    task: schemas.CreateUserTask,
    db: Session = Depends(db.get_db),
) -> models.Tasks:
    try:
        return interface.create_user_tasks(user=current_user, task=task, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    current_user: Annotated[models.Users, Depends(auth.get_current_user)],
    task_id: Annotated[str, Path(min_length=12, max_length=12)],
    db: Session = Depends(db.get_db),
):
    try:
        interface.delete_user_tasks(user=current_user, task_id=task_id, db=db)
    except errors.TaskNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/tasks/{task_id}", response_model=schemas.Tasks)
def update_task(
    current_user: Annotated[models.Users, Depends(auth.get_current_user)],
    task_id: Annotated[str, Path(min_length=12, max_length=12)],
    task: schemas.UpdateUserTask,
    db: Session = Depends(db.get_db),
):
    print(task)
    try:
        return interface.update_user_tasks(
            user=current_user, update_data=task, tasks_id=task_id, db=db
        )
    except errors.TaskNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tasks", response_model=Page[schemas.Tasks])
def get_all_tasks(
    current_user: Annotated[models.Users, Depends(auth.get_current_user)],
    status: Annotated[int | None, Query(ge=0, le=2)] = None,
    db: Session = Depends(db.get_db),
):
    try:
        return interface.get_all_tasks(user=current_user, db=db, status=status)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
