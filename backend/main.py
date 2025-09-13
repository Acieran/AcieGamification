import json
from contextlib import asynccontextmanager
from datetime import datetime
from http import HTTPStatus
from pathlib import Path

from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from backend.database.base_repository import BaseRepository
from backend.database.sql_database_manager import SQLDatabaseManager
from backend.middle_service import create_user_quest_quest_stats
from backend.schemas import UserCreateOrUpdate, Stats, Quest, UserQuests, UserQuestStats, UserQuestStatsAPI, \
    UserCalendarAPI, ShiftType, UserCalendarAPIAll, CalendarUsersAPI
from backend.services import Service
from backend.sheduler.sheduler import Scheduler

current_dir = Path(__file__).parent
db_path = (
        current_dir
        / "gamification.db"
).resolve()

db_repository = BaseRepository(SQLDatabaseManager(f"sqlite:///{db_path}"))
service = Service(db_repository=db_repository)
scheduler = Scheduler(service=service)


class CustomMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        print(f"Incoming request: {request.url}")
        response = await call_next(request)
        print(f"Outgoing response status: {response.status_code}")
        return response


@asynccontextmanager
async def lifespan(_: FastAPI):
    scheduler.start_scheduler()
    yield
    scheduler.shutdown_scheduler()


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods="*",
    allow_headers="*",
)

app.add_middleware(CustomMiddleware)


@app.get("/")
async def root():
    return await get_user_with_stats("Acieran")


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@app.get("/calendar")
async def get_calendar(year: int = datetime.now().year, month: int = datetime.now().month):
    return JSONResponse(service.get_calendar_all(year=year, month=month), status_code=200)


@app.get("/calendar/names")
async def get_calendar_names(year: int = datetime.now().year, month: int = datetime.now().month):
    return JSONResponse(service.get_calendar_name(year=year, month=month), status_code=200)


@app.post("/calendar/names")
async def create_or_update_calendar_names(calendar_names: CalendarUsersAPI):
    if service.create_calendar_name(calendar_names.year, calendar_names.month, calendar_names.user):
        return JSONResponse(status_code=200, content="success")
    return JSONResponse(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, content="There was an error")


@app.post("/calendar")
async def create_or_update_calendar(data: UserCalendarAPI):
    try:
        if service.create_or_update_calendar(
                day=data.day, month=data.month, year=data.year, user=data.user, shift_type=ShiftType(data.shift_type)):
            return JSONResponse(status_code=200, content="success")
        raise Exception()
    except ValueError:
        return JSONResponse(status_code=HTTPStatus.BAD_REQUEST, content="Wrong Shift Type")


@app.post("/calendar_all")
async def create_calendar_all(calendar_data: UserCalendarAPIAll, start_date: int = 1):
    if service.create_calendar(data=calendar_data, start_date=start_date):
        return JSONResponse(status_code=200, content="success")
    return JSONResponse(status_code=500, content="Error creating calendar")


@app.post("/calendar_all_from_file")
async def get_calendar_all_from_file(file: UploadFile):
    data = service.parse_shift_data(file)
    try:
        for entry in data:
            service.create_calendar(data=UserCalendarAPIAll(**entry), start_date=1)
        return JSONResponse(status_code=200, content="success")
    except Exception:
        return JSONResponse(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, content="Error creating calendar")

@app.get("/{username}")
async def get_user_with_stats(username: str):
    data = service.get_user_with_stats(username)
    if data:
        return JSONResponse(data.model_dump(), status_code=200)
    return JSONResponse(status_code=404, content="User not found")

@app.post("/{username}")
async def create_user_with_stats(username: str, user_stats: Stats):
    user = service.get_user(username)
    if user is None:
        stats_id = service.create_stats(user_stats)
        user = service.create_user(UserCreateOrUpdate(username=username, stats_id=stats_id))
    else:
        stats = service.get_stats(user.stats_id)
    if user:
        return JSONResponse(status_code=200, content="success")
    return JSONResponse(status_code=404, content="User not found")

@app.put("/{username}")
async def update_user_stats(username: str, user_stats: Stats, add_to_current_stats: bool = None):
    user = service.get_user(username)
    if user:
        if add_to_current_stats is not None:
            current_stats = service.get_stats(stats_id=user.stats_id)
            for key, value in current_stats.model_dump().items():
                if add_to_current_stats:
                    try:
                        user_stats_value = getattr(user_stats, key)
                        setattr(user_stats, key, value + user_stats_value)
                    except AttributeError:
                        setattr(user_stats, key, value)
                else:
                    user_stats.__setattr__(key, value + user_stats.__getattr__(key))
        stats_id = service.update_stats(stats_id=user.stats_id, stats = user_stats)
        if stats_id:
            return JSONResponse(status_code=200, content="success")
        return JSONResponse(status_code=500, content="Error updating user stats")
    return JSONResponse(status_code=404, content="User not found")


@app.get("/{username}/quests")
async def get_user_quests(username: str, include_completed: bool = False):
    user = service.get_user(username)
    if user:

        user_quests = service.get_user_quests(username)
        result = []
        for i, user_quest in enumerate(user_quests):
            if include_completed or not user_quest.completed:
                quest_info = service.get_quest(user_quest.quest_id)
                quest_stats = service.get_stats(quest_info.stats_id)
                del user_quest.quest_id
                del quest_info.stats_id
                result.append(user_quest.model_dump())
                result[i].update(quest_info.model_dump())
                result[i]["reward"] = quest_stats.model_dump()
                result[i]["due_date"] = result[i]["due_date"].isoformat()
        result = json.dumps(result)
        return JSONResponse(result, status_code=200)
    else:
        return JSONResponse(status_code=404, content="User not found")


@app.post("/{username}/quests")
async def create_user_quest(username: str, data: UserQuestStatsAPI):
    user = service.get_user(username)
    if user:
        user_quest_id = create_user_quest_quest_stats(
            service=service,
            username=username,
            data=data,
        )
        return JSONResponse(user_quest_id, status_code=201)
    return JSONResponse(status_code=404, content="User not found")


@app.put("/{username}/quests/{quest_id}")
async def update_user_quest(username: str, quest_id: int, data: UserQuestStats | None, complete: bool = False):
    user = service.get_user(username)
    if user:
        if complete:
            user_quest_id = service.update_user_quest(
                user_quest=UserQuests(username=username, due_date=data.due_date, completed=True, quest_id=quest_id))
            return JSONResponse(user_quest_id, status_code=200)
        else:
            data_dict = data.model_dump()
            quest = service.get_quest(quest_id)
            stats_id = service.update_stats(quest.stats_id, Stats(**data_dict))
            quest_id = service.update_quest(quest_id, Quest(**data_dict))
            user_quest_id = service.update_user_quest(user_quest=UserQuests(**data_dict))
            if stats_id and quest_id and user_quest_id:
                return JSONResponse(user_quest_id, status_code=200)
        return JSONResponse(status_code=500, content="Error updating user quest")
    return JSONResponse(status_code=404, content="User not found")


# @app.post("/{username}/quests/{quest_id}")

@app.delete("/{username}/quests/{quest_id}")
async def delete_user_quest(username: str, quest_id: int):
    user = service.get_user(username)
    if user:
        stats_id = service.get_quest(quest_id).stats_id
        service.delete_user_quest(quest_id)
        service.delete_quest(quest_id)
        service.delete_stats(stats_id)
        return JSONResponse(status_code=200, content="success")
    return JSONResponse(status_code=404, content="User not found")