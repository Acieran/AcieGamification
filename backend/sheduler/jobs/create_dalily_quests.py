from ...logging_decorator import log
from ...middle_service import create_user_quest_quest_stats
from ...schemas import OccurrenceType, Stats, Type, UserQuestStatsAPI
from ...services import Service
from ...utils.get_due_date import get_midnight_in_days

quests = [
    UserQuestStatsAPI(
        title="Ежедневная тренировка",
        description="",
        due_date=get_midnight_in_days(),
        type=str(Type.MOVEMENT.value),
        occurrence_type=str(OccurrenceType.DAILY.value),
        completed=False,
        reward=Stats(
            energy=0,
            strength=0.2,
            agility=0.2,
            intelligence=0,
            level=0,
            focus=0,
            health=1,
            resource=0,
            gold=1,
            xp=10,
        ),
    ),
]


@log
def create_daily_quests(service: Service, username: str = "Acieran"):
    result = {}
    for quest in quests:
        ok = True
        if user_quests := service.get_user_quests(username, due_date=get_midnight_in_days()):
            quests_ids_with_current_title = service.get_quests_ids_with_params(title=quest.title)
            for user_quest in user_quests:
                if user_quest.quest_id in quests_ids_with_current_title:
                    ok = False
        result[quest.title] = "in_progress"
        try:
            if ok:
                user_quest_id = create_user_quest_quest_stats(
                    service=service, username=username, data=quest
                )
                if user_quest_id:
                    result[quest.title] = "success"
                else:
                    result[quest.title] = "failure"
        except Exception as e:
            result[quest.title] = {"error": e}
    return result
