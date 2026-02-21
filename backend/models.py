# models.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class Product(BaseModel):
    name: str
    category: str = "General"
    current_stock: int = 0

class Transaction(BaseModel):
    product_name: str
    quantity: int  # Positive for IN, Negative for OUT
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class LoginRequest(BaseModel):
    username: str
    password: str