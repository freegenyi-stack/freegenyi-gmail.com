from typing import Optional, List
from sqlmodel import Session, select
from apps.api.src.domain.entities.user import User
from apps.api.src.domain.repositories.user_repository import UserRepository
from apps.api.src.infrastructure.persistence.models import UserTable

class SQLUserRepository(UserRepository):
    def __init__(self, session: Session):
        self.session = session

    def _to_entity(self, table_model: UserTable) -> User:
        return User(
            id=table_model.id,
            email=table_model.email,
            full_name=table_model.full_name,
            hashed_password=table_model.hashed_password,
            is_active=table_model.is_active,
            is_superuser=table_model.is_superuser,
            created_at=table_model.created_at,
            updated_at=table_model.updated_at
        )

    def _to_table(self, entity: User) -> UserTable:
        return UserTable(
            id=entity.id,
            email=entity.email,
            full_name=entity.full_name,
            hashed_password=entity.hashed_password,
            is_active=entity.is_active,
            is_superuser=entity.is_superuser,
            created_at=entity.created_at,
            updated_at=entity.updated_at
        )

    def get_by_id(self, user_id: str) -> Optional[User]:
        statement = select(UserTable).where(UserTable.id == user_id)
        result = self.session.exec(statement).first()
        return self._to_entity(result) if result else None

    def get_by_email(self, email: str) -> Optional[User]:
        statement = select(UserTable).where(UserTable.email == email)
        result = self.session.exec(statement).first()
        return self._to_entity(result) if result else None

    def save(self, user: User) -> User:
        db_user = self._to_table(user)
        self.session.add(db_user)
        self.session.commit()
        self.session.refresh(db_user)
        return self._to_entity(db_user)

    def list(self) -> List[User]:
        statement = select(UserTable)
        results = self.session.exec(statement).all()
        return [self._to_entity(r) for r in results]

    def delete(self, user_id: str) -> None:
        statement = select(UserTable).where(UserTable.id == user_id)
        result = self.session.exec(statement).first()
        if result:
            self.session.delete(result)
            self.session.commit()
