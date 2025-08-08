from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from backend.database.models import Base
from backend.logging_decorator import log


class SQLDatabaseManager:
    def __init__(self,
                 sql_string: str, echo: bool = True,
                 autocommit: bool = False,
                 autoflush: bool = False,
                 expire_on_commit: bool = False):
        self.engine = create_engine(sql_string, echo=echo)  # "sqlite:///database/progresser.db"
        Base.metadata.create_all(self.engine)
        self.SessionLocal = sessionmaker(autocommit=autocommit,
                                         autoflush=autoflush,
                                         bind=self.engine,
                                         expire_on_commit=expire_on_commit)

    @log
    def get_session(self) -> Session:
        return self.SessionLocal()

    @log
    def reset_database(self) -> None:
        Base.metadata.drop_all(self.engine)
        Base.metadata.create_all(self.engine)
