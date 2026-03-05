from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from apps.api.src.infrastructure.persistence.database import get_session
from apps.api.src.infrastructure.persistence.sql_user_repository import SQLUserRepository
from apps.api.src.application.use_cases.create_user import CreateUserUseCase
from apps.api.src.interface_adapters.schemas.user_schema import UserCreate, UserRead

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, session: Session = Depends(get_session)):
    repo = SQLUserRepository(session)
    use_case = CreateUserUseCase(repo)
    try:
        user = use_case.execute(user_in)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[UserRead])
def list_users(session: Session = Depends(get_session)):
    repo = SQLUserRepository(session)
    return repo.list()
