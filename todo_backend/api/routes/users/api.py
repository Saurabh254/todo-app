from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from sqlalchemy.orm import Session

from api.database import db
from typing import Annotated
from . import errors, interface, schemas, models, enums
from fastapi_pagination import Page
from api.auth import auth

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/login", response_model=schemas.LoginResponse)
async def login(data: schemas.LoginUser, db: Session = Depends(db.get_db)):
    try:
        if data.phone[-6:] == data.otp:
            return interface.user_login(phone=data.phone, db=db)
        else:
            raise HTTPException(status_code=401, detail="wrong otp")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me", response_model=schemas.User)
async def get_me(current_user: Annotated[models.Users, Depends(auth.get_current_user)]):
    return current_user


@router.post(
    "/tasks/create_task",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.Tasks,
)
async def create_task(
    current_user: Annotated[models.Users, Depends(auth.get_current_user)],
    task: schemas.CreateUserTask,
    db: Session = Depends(db.get_db),
) -> models.Tasks:
    try:
        return interface.create_user_tasks(user=current_user, task=task, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    current_user: Annotated[models.Users, Depends(auth.get_current_user)],
    task_id: Annotated[str, Path(min_length=12, max_length=12)],
    db: Session = Depends(db.get_db),
):
    try:
        interface.delete_user_tasks(user=current_user, task_id=task_id, db=db)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/tasks/{task_id}", response_model=schemas.Tasks)
async def update_task(
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

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tasks", response_model=Page[schemas.Tasks])
async def get_all_tasks(
    current_user: Annotated[models.Users, Depends(auth.get_current_user)],
    status: Annotated[enums.TaskStatus | None, Query()] = None,
    db: Session = Depends(db.get_db),
):
    try:
        return interface.get_all_tasks(user=current_user, db=db, status=status)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
