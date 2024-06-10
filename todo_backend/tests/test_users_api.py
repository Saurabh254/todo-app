from faker import Faker
from fastapi.testclient import TestClient

from api.routes.users import models as user_models

from .fixtures import *

faker = Faker()


def test_user_login(test_client: TestClient, test_user: user_models.Users):
    response = test_client.post(
        "/users/login",
        json={"phone": test_user.phone[3:], "otp": test_user.phone[-6:]},
    )
    assert response.status_code == 200
    assert response.json()["user"]["phone"] == test_user.phone


def test_get_me(authenticated_user_client: TestClient, test_user: user_models.Users):
    response = authenticated_user_client.get("/users/me")
    assert response.status_code == 200
    assert response.json()["phone"] == test_user.phone


def test_create_task(authenticated_user_client: TestClient):
    title = faker.sentence()
    description = faker.sentence()
    response = authenticated_user_client.post(
        "/users/tasks/create_task",
        json={"title": title, "description": description},
    )
    assert response.status_code == 201
    response_data = response.json()
    assert len(response_data["id"]) == 12
    assert response_data["title"] == title
    assert response_data["description"] == description


def test_update_task(authenticated_user_client: TestClient, test_task):
    title = faker.sentence()
    description = faker.sentence()
    response = authenticated_user_client.patch(
        f"/users/tasks/{test_task.id}",
        json={"title": title, "description": description},
    )
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["title"] == title
    assert response_data["description"] == description


def test_update_status(authenticated_user_client: TestClient, test_task):
    response = authenticated_user_client.patch(
        f"/users/tasks/{test_task.id}",
        json={"status": 1},
    )
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["status"] == 1


def test_delete_tasks(authenticated_user_client: TestClient, test_task):
    response = authenticated_user_client.delete(f"/users/tasks/{test_task.id}")
    assert response.status_code == 204


def test_get_all_tasks(authenticated_user_client: TestClient, test_task):
    response = authenticated_user_client.get(f"/users/tasks")
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data["items"]) == 1
    assert response_data["total"] == 1
