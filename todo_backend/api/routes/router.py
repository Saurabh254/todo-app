from fastapi import APIRouter

from .users import api as users_api

router = APIRouter()

router.include_router(users_api.router)
