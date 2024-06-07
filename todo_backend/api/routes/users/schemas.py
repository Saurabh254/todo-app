from datetime import datetime
from typing import Optional
from . import enums
from pydantic import BaseModel, Field


class LoginUser(BaseModel):
    phone: str = Field(max_length=10, min_length=10)
    otp: str = Field(max_length=6, min_length=6)


class User(BaseModel):
    id: str = Field(min_length=12, max_length=12)
    phone: str = Field(min_length=13, max_length=13)
    created_at: datetime
    updated_at: datetime


class LoginResponse(BaseModel):
    access_token: str
    user: User


class CreateUserTask(BaseModel):
    title: str = Field(max_length=255, min_length=3)
    description: None | str


class UpdateUserTask(BaseModel):
    title: str | None = Field(max_length=255, min_length=3, default=None)
    description: None | str = Field(default=None)
    status: int | None = Field(default=None)


class TasksListFilter(BaseModel):
    status: int | None = None


class Tasks(BaseModel):
    id: str
    title: str
    description: None | str
    status: int
    created_at: datetime
    updated_at: datetime
