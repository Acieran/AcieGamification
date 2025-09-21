from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from ..services import Service
from .jobs.create_dalily_quests import create_daily_quests


class Scheduler:
    scheduler = AsyncIOScheduler()

    def __init__(self, service: Service):
        self.service = service

    def start_scheduler(self):
        create_daily_quests(service=self.service)
        self.scheduler.add_job(
            create_daily_quests,
            trigger=CronTrigger(hour=0, minute=0),
            id="daily_quests_job",
            kwargs={"service": self.service},
        )
        self.scheduler.start()

    def shutdown_scheduler(self):
        self.scheduler.shutdown()
