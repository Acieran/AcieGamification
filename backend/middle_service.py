from backend.logging_decorator import log
from backend.schemas import Quest, Stats, UserQuests, UserQuestStatsAPI
from backend.services import Service


@log
def create_user_quest_quest_stats(
    service: Service, username: str, data: UserQuestStatsAPI
) -> int | None:
    data_dict = data.model_dump()
    data_dict["username"] = username
    stats_id = service.create_stats(Stats(**data_dict["reward"]))
    data_dict["quest_id"] = service.create_quest(
        Quest(
            stats_id=stats_id,
            type=data.type,
            title=data.title,
            description=data.description,
            occurrence_type=data.occurrence_type,
        )
    )
    return service.create_user_quest(user_quest=UserQuests(**data_dict))
