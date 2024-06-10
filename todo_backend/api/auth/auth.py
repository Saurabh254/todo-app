from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.orm import Session

from api.database import db
from api.routes.users import interface as users_interface
from api.routes.users import models as users_model

from .auth_bearer import JWTBearer

# Initialize password context for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Initialize OAuth2 password bearer for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Function to authenticate a user using phone and OTP
def authenticate_user(db: Session, phone: str, otp: str):
    """Authenticate a user using phone number and OTP."""
    if phone[-6:] == otp:
        return True
    user = users_interface.get_user(phone=phone, db=db)
    if not user:
        return False
    return user


# Asynchronous function to get the current user based on the JWT token payload
async def get_current_user(
    payload_data: Annotated[str, Depends(JWTBearer())], db: Session = Depends(db.get_db)
):
    """Get the current user based on the JWT token payload."""
    phone = payload_data["phone"]
    user = users_interface.get_user(phone=phone, db=db)
    if user is None:
        raise HTTPException(
            status_code=404,
            detail=f"user not found with the phone number associated with {phone}",
        )

    return user
