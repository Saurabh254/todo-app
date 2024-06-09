from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from api.database.base_model import BaseModel


class Users(BaseModel):
    phone: Mapped[str] = mapped_column(String, nullable=False)


class Tasks(BaseModel):
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    status: Mapped[int] = mapped_column(default=0)
