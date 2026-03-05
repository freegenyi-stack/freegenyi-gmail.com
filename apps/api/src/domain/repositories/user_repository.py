from abc import ABC, abstractmethod
from typing import Optional, List
from apps.api.src.domain.entities.user import User

class UserRepository(ABC):
    @abstractmethod
    def get_by_id(self, user_id: str) -> Optional[User]:
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]:
        pass

    @abstractmethod
    def save(self, user: User) -> User:
        pass

    @abstractmethod
    def list(self) -> List[User]:
        pass

    @abstractmethod
    def delete(self, user_id: str) -> None:
        pass
