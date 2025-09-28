from datetime import datetime
from enum import Enum

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


class OccurrenceType(Enum):
    DAILY = "daily"
    MONTHLY = "monthly"
    ONE_TIME = "oneTime"


class Type(Enum):
    NUTRITION = "nutrition"
    MOVEMENT = "movement"
    SLEEP = "sleep"
    WATER = "water"
    INTELLECTUAL = "intellectual"


class ShiftType(Enum):
    DAY = "Day"
    NIGHT = "Night"
    DAY_OFF = "Day Off"
    VACATION = "Vacation"
    NONE = ""


class UserStats(User, Stats):
    pass


class QuestBase(BaseModel):
    title: str
    description: str
    occurrence_type: OccurrenceType | str
    type: Type | str


class Quest(QuestBase):
    stats_id: int


class QuestStats(QuestBase, Stats):
    pass


class QuestUpdate(Quest):
    id: int


class UserQuests(User):
    due_date: datetime
    completed: bool
    quest_id: int


class UserQuestStats(QuestStats):
    due_date: datetime
    completed: bool


class UserQuestStatsAPI(QuestBase):
    due_date: datetime
    completed: bool
    reward: Stats


class CalendarAPI(BaseModel):
    date: str
    shifts: dict[str, str] | None


class UserCalendarAPI(BaseModel):
    day: int
    month: int
    year: int
    user: str
    shift_type: str
    order: int


class CalendarUsersAPI(BaseModel):
    year: int
    month: int
    user: str
    order: int


class UserCalendarAPIAll(BaseModel):
    year: int
    month: int
    user: str
    shifts: list[str]


asd = [
    "Day",
    "",
    "Day",
    "Day",
    "Night",
    "Day Off",
    "Day Off",
    "Day Off",
    "Day",
    "Day",
    "Day Off",
    "Day Off",
    "Day",
    "Day",
    "Day",
    "Night",
    "Day Off",
    "Day Off",
]
