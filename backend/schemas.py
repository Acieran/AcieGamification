import datetime

from pydantic import BaseModel


class User(BaseModel):
    username: str


class UserCreateOrUpdate(User):
    stats_id: int


class Stats(BaseModel):
    energy: float
    strength: float
    agility: float
    intelligence: float
    level: int
    focus: float
    health: int
    resource: int
    gold: int
    xp: int


class StatsCreateOrUpdate(Stats):
    id: int


class UserStats(User, Stats):
    pass


class Quest(BaseModel):
    stats_id: int
    title: str
    description: str
    type: str


class QuestCreate(Quest, Stats):
    pass


class QuestsUpdate(QuestCreate):
    id: int


class UserQuests(User):
    due_date: datetime.datetime
    completed: bool
    quest_id: int


class UserQuestsCreateOrUpdate(User, Quest, Stats):
    due_date: datetime.datetime
    completed: bool
