from functools import wraps
from typing import Any, Callable, TypeVar, cast, get_type_hints

from sqlalchemy import exc, select, inspect
from sqlalchemy import inspect as sqlalchemy_inspect
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, Mapper

from backend.database.models import Base
from backend.database.sql_database_manager import SQLDatabaseManager
from backend.logging_decorator import log

T = TypeVar('T', bound=Base)
F = TypeVar('F', bound=Callable[..., Any])


class BaseRepository:
    """
    Repository that initialized basic database operations(CRUD)
    and transaction handling.
    """

    def __init__(self, db_manager: SQLDatabaseManager):
        self.db_manager = db_manager
        self._session: Session | None = None

    @log
    def transaction(self) -> '_TransactionHelper':
        """Use this when you need multi-operation transactions"""
        return self._TransactionHelper(self)

    @log
    def get_session(self) -> Session | None:
        """Return the current session"""
        return self._session

    @log
    def _ensure_session(self) -> Session:
        if self._session is None:
            raise RuntimeError("Session is not available")
        return self._session

    @staticmethod
    @log
    def transaction_decorator(func: F) -> F:
        """
        Decorator of all database methods that allows to run methods
        without explicitly managing transactions
        """

        @wraps(func)
        def wrapper(self: 'BaseRepository', model: type[Base], *args: Any, **kwargs: Any) -> Any:
            if self.get_session() is None:
                with self.transaction():
                    session = self.get_session()
                    assert session is not None
                    return func(self, model, *args, **kwargs)
            else:
                return func(self, model, *args, **kwargs)

        return cast(F, wrapper)

    class _TransactionHelper:
        def __init__(self, repository: 'BaseRepository') -> None:
            self.repository = repository

        def __enter__(self) -> 'BaseRepository':
            # Start a new session if none exists
            if self.repository._session is None:
                self.repository._session = self.repository.db_manager.get_session()
            return self.repository

        def __exit__(self,
                     exc_type: type[BaseException] | None,
                     exc_val: BaseException | None,
                     exc_tb: Any | None) -> None:
            session = self.repository._ensure_session()

            if exc_type is None:
                session.commit()
            else:
                session.rollback()
            session.close()
            self.repository._session = None

    @transaction_decorator
    @log
    def create(self, model: type[Base], **kwargs: Any) -> str | int | None:
        """Creates a new record in the database."""
        try:
            instance = model(**kwargs)
            self._ensure_session().add(instance)
            self._ensure_session().flush()
            return self.get_primary_key_value(instance)
        except exc.SQLAlchemyError as e:
            raise e

    @transaction_decorator
    @log
    def get_by_id(self, model: type[T], item_id: str | int) -> dict[str, Any] | None:
        """Retrieves a record by its primary key (assuming id)."""
        try:
            result = self._ensure_session().get(model, item_id)
            if not result:
                return None
            return result.to_dict()
        except exc.SQLAlchemyError as e:
            raise e

    @transaction_decorator
    @log
    def get_by_custom_field(self,
                            model: type[T],
                            field_name: str,
                            field_value: Any) -> dict[str, Any] | None:
        """
        Retrieves a record from the database based on a custom field name and value.

        Args:
            model: The name of model to find record in.
            field_name: The name of the field to filter on (as a string).
            field_value: The value to filter the field by.

        Returns:
            The first matching record, or None if no matching record is found.

        Raises:
            ValueError: If the field_name is not a valid attribute of the model.
            TypeError: If model is not a valid SQLAlchemy model.
        """
        if not isinstance(model, type) or not issubclass(model, Base):
            raise TypeError("model must be a SQLAlchemy model class (DeclarativeBase)")

        inspector = sqlalchemy_inspect(model)
        attribute_names = [c.key for c in inspector.columns]

        if field_name not in attribute_names:
            raise ValueError(f"Invalid field_name:{field_name}. Valid fields are:{attribute_names}")

        try:
            result = (self._ensure_session().query(model).
                      where(inspector.columns[field_name] == field_value).
                      first())
            if result and isinstance(result, Base):
                return result.to_dict()
            return None

        except exc.SQLAlchemyError as e:
            raise e

    @transaction_decorator
    @log
    def get_by_custom_fields(
            self,
            model: type[Base],
            offset: int = 0,
            limit: int = None,
            **kwargs: Any
    ) -> list[dict[str, Any]]:
        """
        Retrieves records from the database based on multiple custom fields
        specified as keyword arguments.

        Args:
            model: The SQLAlchemy model class to query.
            offset: The offset to start with.
            limit: The number of records to return.
            **kwargs: Keyword arguments representing name = value to search for.
                       For example: `username="testuser", email="test@example.com"`

        Returns:
            A list of records that match the specified search criteria.
        """
        try:
            inspector = sqlalchemy_inspect(model)

            query = select(model)
            for field, value in kwargs.items():
                column = getattr(model, field, None)  # Get the column object from the model
                if column is None:
                    raise SQLAlchemyError(f"Model '{str(model)}' has no attribute '{field}'")
                query = query.where(inspector.columns[field] == value)

            # Apply offset and limit
            if offset > 0:
                query = query.offset(offset)
            if limit is not None:
                query = query.limit(limit)

            # Execute the query and return the results
            result = self._ensure_session().execute(query).scalars().all()
            return [x.to_dict() for x in result]

        except exc.SQLAlchemyError as e:
            raise e

    @transaction_decorator
    @log
    def update(self, model: type[Base], item_id: str | int, **data: Any) -> bool:
        """Updates a record in the database."""
        try:
            instance = self._ensure_session().get(model, item_id)
            if instance:
                for key, value in data.items():
                    if hasattr(instance, key) and key in get_type_hints(model):
                        setattr(instance, key, value)
                return True
            return False
        except exc.SQLAlchemyError as e:
            raise e

    @transaction_decorator
    @log
    def delete(self, model: type[Base], item_id: str | int) -> bool:
        """Deletes a record from the database."""
        try:
            session = self._ensure_session()
            instance = session.get(model, item_id)
            if instance:
                session.delete(instance)
                return True
            return False
        except exc.SQLAlchemyError as e:
            raise e

    @transaction_decorator
    @log
    def get_all(self, model: type[Base]) -> list[dict[str, Any]]:
        """Returns all records of the database table"""
        try:
            result = self._ensure_session().query(model).all()
            return [x.to_dict() for x in result if isinstance(x, Base)]
        except exc.SQLAlchemyError as e:
            raise e

    @staticmethod
    @log
    def get_primary_key_value(instance) -> str | int | None:
        """
        Get primary key value(s) of a SQLAlchemy model instance.
        Returns a single value for single-column PKs, or a tuple for composite PKs.
        Returns None if the instance is transient (not persisted).
        """
        # Get the instance state
        state = inspect(instance)

        # If identity exists (instance is persistent), use it directly
        if state.identity is not None:
            return state.identity[0] if len(state.identity) == 1 else state.identity

        # For transient instances, manually fetch PK values
        mapper: Mapper = state.mapper
        pk_attrs = [prop.key for prop in mapper.primary_key]

        if not pk_attrs:
            return None  # No primary key defined

        # Get values from instance attributes
        pk_values = [getattr(instance, attr) for attr in pk_attrs]

        # Return single value for single-column PK, tuple for composite PK
        return pk_values[0] if len(pk_values) == 1 else tuple(pk_values)
