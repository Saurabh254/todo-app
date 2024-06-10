from datetime import datetime
from typing import Optional

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
    description: Optional[str]
    status: int = Field(ge=0, le=2, default=0)


class UpdateUserTask(BaseModel):
    title: Optional[str] = Field(max_length=255, min_length=3, default=None)
    description: Optional[str] = Field(default=None)
    status: Optional[int] = Field(default=None, ge=0, le=2)


class TasksListFilter(BaseModel):
    status: Optional[int] = None


class Tasks(BaseModel):
    id: str
    title: str
    description: Optional[str]
    status: int
    created_at: datetime
    updated_at: datetime
