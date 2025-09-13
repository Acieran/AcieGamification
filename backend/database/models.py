import random
from datetime import datetime
from typing import Any

from sqlalchemy import Boolean, Float, String, inspect, Integer, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    def to_dict(self) -> dict[str, Any]:
        """Convert model to dictionary, optionally excluding relationships."""
        mapper = inspect(self.__class__)
        result = {}

        for column in mapper.columns:
            result[column.name] = getattr(self, column.name)
        return result


class User(Base):
    __tablename__ = "user"
    username: Mapped[str] = mapped_column(primary_key=True)
    stats_id: Mapped[int] = mapped_column(Integer, nullable=False)


class UserQuests(Base):
    __tablename__ = "user_quests"
    quest_id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    username: Mapped[str] = mapped_column(String, nullable=False)
    due_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)


class Stats(Base):
    __tablename__ = "stats"
    id: Mapped[int] = mapped_column(primary_key=True)
    energy: Mapped[float] = mapped_column(Float, default=random.random())
    strength: Mapped[float] = mapped_column(Float, default=random.random())
    agility: Mapped[float] = mapped_column(Float, default=random.random())
    intelligence: Mapped[float] = mapped_column(Float, default=random.random())
    level: Mapped[int] = mapped_column(Integer, default=1)
    focus: Mapped[float] = mapped_column(Float, default=random.random())
    health: Mapped[int] = mapped_column(Integer, default=random.randint(1, 100))
    resource: Mapped[int] = mapped_column(Integer, default=random.randint(1, 100))
    gold: Mapped[int] = mapped_column(Integer, default=0)
    xp: Mapped[int] = mapped_column(Integer, default=0)


class Quests(Base):
    __tablename__ = "quests"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    type: Mapped[str] = mapped_column(String, nullable=False)
    stats_id: Mapped[int] = mapped_column(Integer, nullable=True)
    occurrence_type: Mapped[str] = mapped_column(String, nullable=False)


class Prerequisites(Base):
    __tablename__ = "prerequisites"
    quest_id: Mapped[int] = mapped_column(primary_key=True)
    prerequisite_id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    done: Mapped[bool] = mapped_column(Boolean, default=False)


class Calendar(Base):
    __tablename__ = "calendar"
    id: Mapped[int] = mapped_column(primary_key=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    month: Mapped[int] = mapped_column(Integer, nullable=False)
    day: Mapped[int] = mapped_column(Integer, nullable=False)
    user: Mapped[str] = mapped_column(String, nullable=False)
    shift_type: Mapped[str] = mapped_column(String, nullable=False)


class CalendarNames(Base):
    __tablename__ = "calendar_names"
    id: Mapped[int] = mapped_column(primary_key=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    month: Mapped[int] = mapped_column(Integer, nullable=False)
    user: Mapped[str] = mapped_column(String, nullable=False)
