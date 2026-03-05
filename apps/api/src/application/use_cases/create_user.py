from apps.api.src.domain.entities.user import User
from apps.api.src.domain.repositories.user_repository import UserRepository
from apps.api.src.interface_adapters.schemas.user_schema import UserCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class CreateUserUseCase:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def execute(self, user_data: UserCreate) -> User:
        # Business logic: check if email exists
        if self.user_repo.get_by_email(user_data.email):
            raise ValueError("User with this email already exists")

        hashed_password = pwd_context.hash(user_data.password)
        
        user = User.create(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_password
        )
        
        return self.user_repo.save(user)
