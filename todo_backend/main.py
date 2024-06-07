from contextlib import asynccontextmanager

from brotli_asgi import BrotliMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination
from api.base import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting fastapi app")
    yield


app = FastAPI(lifespan=lifespan, root_path="/hello")

add_pagination(app)
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    BrotliMiddleware,
    minimum_size=100,
)
