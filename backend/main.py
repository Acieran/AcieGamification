from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import JSONResponse

from backend.database.base_repository import BaseRepository
from backend.database.sql_database_manager import SQLDatabaseManager
from fastapi.middleware.cors import CORSMiddleware

from backend.schemas import UserCreateOrUpdate, Stats, UserQuestsCreateOrUpdate, Quest, UserQuests
from backend.services import Service

current_dir = Path(__file__).parent
db_path = (
        current_dir
        / "gamification.db"
).resolve()

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


db_repository = BaseRepository(SQLDatabaseManager(f"sqlite:///{db_path}"))
service = Service(db_repository=db_repository)


@app.get("/")
async def root():
    return await get_user_with_stats("Acieran")


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

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
async def update_user_stats(username: str, user_stats: Stats):
    user = service.get_user(username)
    if user:
        stats_id = service.update_stats(stats_id=user.stats_id, stats = user_stats)
        if stats_id:
            return JSONResponse(status_code=200, content="success")
        return JSONResponse(status_code=500, content="Error updating user stats")
    return JSONResponse(status_code=404, content="User not found")


@app.get("/{username}/quests")
async def get_user_quests(username: str):
    user = service.get_user(username)
    if user:
        result = []
        user_quests = service.get_user_quests(username)
        for user_quest in user_quests:
            quest_info = service.get_quest(user_quest.quest_id)
            quest_stats = service.get_stats(quest_info.stats_id)
            del user_quest.quest_id
            del quest_info.stats_id
            result.append(user_quest.model_dump() | quest_info.model_dump() | quest_stats.model_dump())
        return JSONResponse(result, status_code=200)
    else:
        return JSONResponse(status_code=404, content="User not found")

@app.post("/{username}/quests/")
async def create_user_quest(username: str, data: UserQuestsCreateOrUpdate):
    user = service.get_user(username)
    if user:
        data_dict = data.model_dump()
        stats_id = service.create_stats(Stats(**data_dict))
        data_dict["quest_id"] = service.create_quest(Quest(stats_id=stats_id, type=data.type))
        user_quest_id = service.create_user_quest(user_quest=UserQuests(**data_dict))
        return JSONResponse(user_quest_id, status_code=201)
    return JSONResponse(status_code=404, content="User not found")


@app.put("/{username}/quests/{quest_id}")
async def update_user_quest(username: str, quest_id: int, data: UserQuestsCreateOrUpdate):
    user = service.get_user(username)
    if user:
        data_dict = data.model_dump()
        quest = service.get_quest(quest_id)
        stats_id = service.update_stats(quest.stats_id, Stats(**data_dict))
        quest_id = service.update_quest(quest_id, Quest(**data_dict))
        user_quest_id = service.update_user_quest(user_quest=UserQuests(**data_dict))
        if stats_id and quest_id and user_quest_id:
            return JSONResponse(user_quest_id, status_code=200)
        else:
            return JSONResponse(status_code=500, content="Error updating user quest")
    return JSONResponse(status_code=404, content="User not found")

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

