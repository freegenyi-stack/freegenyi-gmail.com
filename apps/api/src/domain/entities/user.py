from dataclasses import dataclass
from datetime import datetime
from typing import Optional
import uuid

@dataclass
class User:
    id: uuid.UUID
    email: str
    full_name: str
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime = dataclass(default_factory=datetime.utcnow)
    updated_at: datetime = dataclass(default_factory=datetime.utcnow)

    @classmethod
    def create(cls, email: str, full_name: str, hashed_password: str) -> "User":
        return cls(
            id=uuid.uuid4(),
            email=email,
            full_name=full_name,
            hashed_password=hashed_password
        )
