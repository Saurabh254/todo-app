from datetime import datetime

from nanoid import generate
from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, declarative_mixin, declared_attr, mapped_column

from .db import Base


@declarative_mixin
class MyMixin:
    id: Mapped[str] = mapped_column(
        String(12), default=lambda: generate(size=12), primary_key=True, unique=True
    )
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.now)
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime, default=datetime.now, onupdate=datetime.now
    )

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()

    __table_args__ = {"mysql_engine": "InnoDB"}
    __mapper_args__ = {"always_refresh": True}


class BaseModel(MyMixin, Base):
    __abstract__ = True
