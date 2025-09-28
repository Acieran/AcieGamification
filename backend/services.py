import calendar
import json
from datetime import datetime

from fastapi import UploadFile
from sqlalchemy.exc import SQLAlchemyError

from backend.database.base_repository import BaseRepository
from backend.database.models import Calendar, CalendarNames
from backend.database.models import Quests as QuestsModel
from backend.database.models import Stats as StatsModel
from backend.database.models import User as UserModel
from backend.database.models import UserQuests as UserQuestsModel
from backend.logging_decorator import log
from backend.schemas import (
    CalendarAPI,
    ShiftType,
    UserCalendarAPIAll,
    UserCreateOrUpdate,
    UserStats,
)
from backend.schemas import Quest as QuestSchema
from backend.schemas import QuestUpdate as QuestCreateSchema
from backend.schemas import Stats as StatsSchema
from backend.schemas import UserQuests as UserQuestsSchema


class Service:
    def __init__(self, db_repository: BaseRepository):
        self.db_repository = db_repository

    @log
    def get_user(self, username: str) -> UserCreateOrUpdate | None:
        user = self.db_repository.get_by_id(UserModel, username)
        if user is not None:
            return UserCreateOrUpdate(**user)
        return None

    @log
    def get_user_with_stats(self, username: str) -> UserStats | None:
        user = self.db_repository.get_by_id(UserModel, username)
        if user is not None:
            stats = self.db_repository.get_by_id(StatsModel, user["stats_id"])
            if stats is not None:
                return UserStats(username=username, **stats)
        return None

    @log
    def create_user(self, user: UserCreateOrUpdate) -> str | None:
        user = self.db_repository.create(UserModel, **user.model_dump())
        if user:
            return user
        return None

    @log
    def update_user(self, user: UserCreateOrUpdate) -> str | None:
        db_id = self.db_repository.get_by_id(UserModel, user.id)
        if db_id is not None:
            if self.db_repository.update(UserModel, **user.model_dump()):
                return user.username
        return None

    @log
    def create_stats(self, stats: StatsSchema) -> int | None:
        stats = self.db_repository.create(StatsModel, **stats.model_dump())
        if stats:
            return stats
        return None

    @log
    def update_stats(self, stats_id: int, stats: StatsSchema) -> int | None:
        db_id = self.db_repository.get_by_id(StatsModel, stats_id)
        if db_id is not None:
            if self.db_repository.update(StatsModel, stats_id, **stats.model_dump()):
                return stats_id
        return None

    @log
    def delete_stats(self, stats_id: int) -> bool:
        self.db_repository.delete(StatsModel, stats_id)
        return True

    @log
    def create_quest(self, quest: QuestSchema) -> int | None:
        return self.db_repository.create(
            QuestsModel,
            stats_id=quest.stats_id,
            type=quest.type,
            title=quest.title,
            description=quest.description,
            occurrence_type=quest.occurrence_type,
        )

    @log
    def update_quest(self, quest_id: int, quest: QuestSchema) -> int | None:
        return self.db_repository.update(
            QuestsModel, item_id=quest_id, stats_id=quest.stats_id, type=quest.type
        )

    @log
    def delete_quest(self, quest_id: int) -> bool:
        self.db_repository.delete(QuestsModel, item_id=quest_id)
        return True

    @log
    def get_user_quests(self, username: str, **kwargs) -> list[UserQuestsSchema]:
        user_quests_dict = self.db_repository.get_by_custom_fields(
            UserQuestsModel, username=username, **kwargs
        )
        result = []
        for user_quest in user_quests_dict:
            result.append(UserQuestsSchema(**user_quest))
        return result

    @log
    def get_quest(self, quest_id: int, **kwargs) -> QuestCreateSchema | None:
        if result := self.db_repository.get_by_id(QuestsModel, quest_id):
            return QuestCreateSchema(**result)
        return None

    @log
    def get_quests_ids_with_params(self, **kwargs) -> list[int | None]:
        result = []
        if quests := self.db_repository.get_by_custom_fields(QuestsModel, **kwargs):
            for quest in quests:
                result.append(quest["id"])
        return result

    @log
    def get_stats(self, stats_id) -> StatsSchema:
        return StatsSchema(**self.db_repository.get_by_id(StatsModel, stats_id))

    @log
    def create_user_quest(self, user_quest: UserQuestsSchema) -> int | None:
        return self.db_repository.create(UserQuestsModel, **user_quest.model_dump())

    @log
    def update_user_quest(self, user_quest: UserQuestsSchema) -> int | None:
        return self.db_repository.update(UserQuestsModel, **user_quest.model_dump())

    @log
    def delete_user_quest(self, quest_id: int) -> bool:
        self.db_repository.delete(UserQuestsModel, quest_id)
        return True

    @log
    def get_calendar_all(self, year: int, month: int) -> list[CalendarAPI] | None:
        num_days = calendar.monthrange(year, month)[1]
        result = []
        for day in range(1, num_days + 1):
            db_data = self.db_repository.get_by_custom_fields(
                Calendar, year=year, month=month, day=day
            )
            shifts = {}
            if db_data is not None:
                for item in db_data:
                    shifts[item["user"]] = item["shift_type"]
                if len(shifts) != 0:
                    temp = CalendarAPI(date=datetime(year, month, day).isoformat(), shifts=shifts)
                    result.append(temp.model_dump())
        return result

    @log
    def create_or_update_calendar(
        self, year: int, month: int, day: int, user: str, shift_type: ShiftType, order: int
    ) -> int | None:
        db_record = self.db_repository.get_by_custom_fields(
            Calendar, year=year, month=month, day=day, user=user
        )
        if len(db_record) > 0:
            result = self.db_repository.update(
                model=Calendar,
                item_id=db_record[0]["id"],
                year=year,
                month=month,
                day=day,
                user=user,
                shift_type=shift_type.value,
            )
        else:
            result = self.db_repository.create(
                model=Calendar,
                year=year,
                month=month,
                day=day,
                user=user,
                shift_type=shift_type.value,
            )
        if (
            self.db_repository.get_by_custom_fields(
                CalendarNames, year=year, month=month, user=user, order=order
            )
            is None
        ):
            self.db_repository.create(CalendarNames, year=year, month=month, user=user)
        return result

    @log
    def create_calendar(self, data: UserCalendarAPIAll, start_date: int):
        if (
            len(
                self.db_repository.get_by_custom_fields(
                    CalendarNames, year=data.year, month=data.month, user=data.user
                )
            )
            == 0
        ):
            self.db_repository.create(
                CalendarNames, year=data.year, month=data.month, user=data.user
            )
        try:
            for key, shift in enumerate(data.shifts, start=start_date):
                try:
                    ShiftType(shift)
                    self.db_repository.create(
                        model=Calendar,
                        year=data.year,
                        month=data.month,
                        day=key,
                        user=data.user,
                        shift_type=shift,
                    )
                except ValueError:
                    continue
            return True
        except SQLAlchemyError:
            return False

    @log
    def get_calendar_name(self, year: int, month: int, order_by: bool | None = None):
        order_by_db = None
        if order_by is not None:
            if order_by:
                order_by_db = {f"{CalendarNames.order.key}": True}
            else:
                order_by_db = {f"{CalendarNames.order.key}": False}
        return self.db_repository.get_by_custom_fields(
            CalendarNames, year=year, month=month, order_by=order_by_db
        )

    @log
    def create_calendar_name(self, year: int, month: int, user: str, order: int) -> int | bool:
        items = self.db_repository.get_by_custom_fields(
            CalendarNames, year=year, month=month, user=user
        )
        if items and len(items) > 0:
            return self.db_repository.update(
                model=CalendarNames,
                item_id=items[0]["id"],
                year=year,
                month=month,
                user=user,
                order=order,
            )
        return self.db_repository.create(
            CalendarNames, year=year, month=month, user=user, order=order
        )

    @log
    def parse_shift_data(self, file: UploadFile) -> list[dict]:
        try:
            return json.load(file.file)
        except FileNotFoundError:
            print(f"Error: File '{file.file}' not found.")
            return []
        except json.JSONDecodeError:
            print(f"Error: File '{file.file}' contains invalid JSON.")
            return []

    def delete_calendar_name(self, year, month, user):
        items = self.db_repository.get_by_custom_fields(
            CalendarNames, year=year, month=month, user=user
        )
        if items and len(items) > 0:
            return self.db_repository.delete(CalendarNames, items[0]["id"])
        return True
