import pytest
from faker import Faker
from fastapi.testclient import TestClient
from fastapi_pagination import add_pagination
from sqlalchemy.orm import Session

from api.auth import auth
from api.database.db import get_db
from api.database.test_db import *
from api.routes.router import router as base_router
from api.routes.users import models as user_models
from main import app

fake = Faker()


@pytest.fixture(scope="function")
def test_client(get_test_db: Session):
    app.dependency_overrides[get_db] = lambda: get_test_db
    client = TestClient(app)
    client.app.include_router(base_router)
    add_pagination(client.app)
    return client


@pytest.fixture(scope="function")
def test_user(get_test_db: Session):
    user = user_models.Users(phone="+918989898989")  # type: ignore
    get_test_db.add(user)
    get_test_db.commit()
    get_test_db.refresh(user)
    return user


@pytest.fixture(scope="function")
def authenticated_user_client(test_client: TestClient, test_user):
    test_client.app.dependency_overrides[auth.get_current_user] = lambda: test_user  # type: ignore
    return test_client


@pytest.fixture(scope="function")
def test_task(test_user, get_test_db: Session):
    task = user_models.Tasks(title=fake.sentence(), description=fake.sentence(), user_id=test_user.id)  # type: ignore
    get_test_db.add(task)
    get_test_db.commit()
    get_test_db.refresh(task)
    return task
