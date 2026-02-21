import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_DETAILS")

client = AsyncIOMotorClient(MONGO_DETAILS)
db = client.warehouse_db 

# This replaces the need for custom logic inside this file
def product_helper(product) -> dict:
    return {
        "id": str(product["_id"]),
        "name": product["name"],
        "category": product.get("category", "General"),
        # Map 'current_stock' from DB to 'stock' for the Frontend
        "stock": product.get("current_stock", 0), 
    }