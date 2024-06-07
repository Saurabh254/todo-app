from sqlalchemy.orm import Session

from fastapi_pagination.ext.sqlalchemy import paginate
from . import errors, models, schemas, enums
from api.auth import auth_bearer, auth


def create_user(phone: str, db: Session):
    phone = "+91" + phone if len(phone) == 10 else phone
    user = get_user(phone=phone, db=db)
    if user:
        return user
    user = models.Users(phone=phone)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user(phone: str, db: Session):
    phone = "+91" + phone if len(phone) == 10 else phone
    user = db.query(models.Users).filter(models.Users.phone == phone).scalar()
    return user


def user_login(phone: str, db: Session) -> dict[str, str]:
    user = create_user(phone=phone, db=db)
    db.add(user)
    db.commit()
    db.refresh(user)
    data = {"id": user.id, "phone": user.phone}
    access_token = auth_bearer.create_access_token(data=data)
    return {"access_token": access_token, "user": user}


def create_user_tasks(
    user: models.Users, task: schemas.CreateUserTask, db: Session
) -> models.Tasks:
    task = models.Tasks(
        user_id=user.id,
        title=task.title,
        description=task.description,
        status=enums.TaskStatus.TODO.value,
    )  # type: ignore
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_task(user_id: str, task_id: str, db: Session) -> models.Tasks | None:
    return (
        db.query(models.Tasks)
        .filter(models.Tasks.user_id == user_id, models.Tasks.id == task_id)
        .scalar()
    )


def delete_user_tasks(user: models.Users, task_id: str, db: Session) -> None:
    task = get_task(user_id=user.id, task_id=task_id, db=db)
    if not task:
        raise errors.TaskNotFoundError(task_id=task_id)
    db.delete(task)
    db.commit()


def update_user_tasks(
    user: models.Users, update_data: schemas.UpdateUserTask, tasks_id: str, db: Session
) -> models.Tasks:
    task = get_task(user_id=user.id, task_id=tasks_id, db=db)
    if update_data.title:
        task.title = update_data.title
    if update_data.description:
        task.description = update_data.description
    if update_data.status:
        task.status = update_data.status
    db.commit()
    db.refresh(task)
    return task


def get_all_tasks(
    user: models.Users, status: int | None, db: Session
) -> list[models.Users]:
    query = db.query(models.Tasks).filter(models.Tasks.user_id == user.id)
    if status:
        query.filter(models.Tasks.status == status)

    return paginate(db, query)  # type: ignore
