from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy.orm import Session

from api.auth import auth, auth_bearer

from . import errors, models, schemas


# Function to create a new user or retrieve an existing user by phone number
def create_user(phone: str, db: Session):
    """Create a new user if not exists, otherwise retrieve the existing user."""
    phone = "+91" + phone if len(phone) == 10 else phone
    user = get_user(phone=phone, db=db)
    if user:
        return user
    user = models.Users(phone=phone)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# Function to retrieve a user by phone number
def get_user(phone: str, db: Session):
    """Retrieve a user by phone number."""
    phone = "+91" + phone if len(phone) == 10 else phone
    user = db.query(models.Users).filter(models.Users.phone == phone).scalar()
    return user


# Function to perform user login
def user_login(phone: str, db: Session) -> dict[str, str]:
    """Perform user login and generate access token."""
    user = create_user(phone=phone, db=db)
    db.add(user)
    db.commit()
    db.refresh(user)
    data = {"id": user.id, "phone": user.phone}
    access_token = auth_bearer.create_access_token(data=data)
    return {"access_token": access_token, "user": user}


# Function to create a new task for a user
def create_user_tasks(
    user: models.Users, task: schemas.CreateUserTask, db: Session
) -> models.Tasks:
    """Create a new task for a user."""
    task = models.Tasks(
        user_id=user.id,
        title=task.title,
        description=task.description,
        status=task.status,
    )  # type: ignore
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


# Function to retrieve a task by user ID and task ID
def get_task(user_id: str, task_id: str, db: Session) -> models.Tasks:
    """Retrieve a task by user ID and task ID."""
    return (
        db.query(models.Tasks)
        .filter(models.Tasks.user_id == user_id, models.Tasks.id == task_id)
        .scalar()
    )


# Function to delete a task for a user
def delete_user_tasks(user: models.Users, task_id: str, db: Session) -> None:
    """Delete a task for a user."""
    task = get_task(user_id=user.id, task_id=task_id, db=db)
    if not task:
        raise errors.TaskNotFoundError(task_id=task_id)
    db.delete(task)
    db.commit()


# Function to update a task for a user
def update_user_tasks(
    user: models.Users, update_data: schemas.UpdateUserTask, tasks_id: str, db: Session
) -> models.Tasks:
    """Update a task for a user."""
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


# Function to retrieve all tasks for a user
def get_all_tasks(
    user: models.Users, status: int | None, db: Session
) -> list[models.Users]:
    """Retrieve all tasks for a user."""
    query = db.query(models.Tasks).filter(models.Tasks.user_id == user.id)
    if status:
        query.filter(models.Tasks.status == status)

    return paginate(db, query)  # type: ignore
