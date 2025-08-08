from backend.database.base_repository import BaseRepository
from backend.database.models import (User as UserModel,
                                     Stats as StatsModel,
                                     Quests as QuestsModel, UserQuests as UserQuestsModel)
from backend.schemas import (UserCreateOrUpdate,
                             UserStats,
                             Stats as StatsSchema,
                             QuestCreate as QuestCreateSchema,
                             Quest as QuestSchema,
                             UserQuests as UserQuestsSchema)


class Service:
    def __init__(self, db_repository: BaseRepository):
        self.db_repository = db_repository

    def get_user(self, username: str) -> UserCreateOrUpdate | None:
        user = self.db_repository.get_by_id(UserModel, username)
        if user is not None:
            return UserCreateOrUpdate(**user)
        return None

    def get_user_with_stats(self, username: str) -> UserStats | None:
        user = self.db_repository.get_by_id(UserModel, username)
        if user is not None:
            stats = self.db_repository.get_by_id(StatsModel, user["stats_id"])
            if stats is not None:
                return UserStats(username=username, **stats)
        return None

    def create_user(self, user: UserCreateOrUpdate) -> str | None:
        user = self.db_repository.create(UserModel, **user.model_dump())
        if user:
            return user
        return None

    def create_stats(self, stats: StatsSchema) -> int | None:
        stats = self.db_repository.create(StatsModel, **stats.model_dump())
        if stats:
            return stats
        return None

    def update_stats(self, stats_id: int, stats: StatsSchema) -> int | None:
        db_id = self.db_repository.get_by_id(StatsModel, stats_id)
        if db_id is not None:
            if self.db_repository.update(StatsModel, stats_id, **stats.model_dump()):
                return stats_id
        return None

    def delete_stats(self, stats_id: int) -> bool:
        self.db_repository.delete(StatsModel, stats_id)
        return True

    def create_quest(self, quest: QuestSchema) -> int | None:
        return self.db_repository.create(QuestsModel, stats_id=quest.stats_id, type=quest.type)

    def update_quest(self, quest_id: int, quest: QuestSchema) -> int | None:
        return self.db_repository.update(QuestsModel, item_id=quest_id, stats_id=quest.stats_id, type=quest.type)

    def delete_quest(self, quest_id: int) -> bool:
        self.db_repository.delete(QuestsModel, item_id=quest_id)
        return True

    def get_user_quests(self, username: str) -> list[UserQuestsSchema]:
        pass

    def get_quest(self, quest_id: int) -> QuestCreateSchema:
        pass

    def get_stats(self, stats_id) -> StatsSchema:
        pass

    def create_user_quest(self, user_quest: UserQuestsSchema) -> int | None:
        return self.db_repository.create(UserQuestsModel, **user_quest.model_dump())

    def update_user_quest(self, user_quest: UserQuestsSchema) -> int | None:
        return self.db_repository.update(UserQuestsModel, **user_quest.model_dump())

    def delete_user_quest(self, quest_id: int) -> bool:
        self.db_repository.delete(UserQuestsModel, quest_id)
        return True
