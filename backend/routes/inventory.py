from fastapi import APIRouter, HTTPException
from models import Transaction
from database import db, product_helper
from datetime import datetime

router = APIRouter()

@router.get("/products")
async def get_all_products():
    products = await db.products.find().to_list(100)
    return [product_helper(p) for p in products]

@router.post("/transaction")
async def log_transaction(transaction: Transaction):
    try:
        # The 'upsert' logic happens right here now
        await db.products.update_one(
            {"name": transaction.product_name},
            {
                "$inc": {"current_stock": transaction.quantity},
                "$setOnInsert": {"category": "General"}
            },
            upsert=True
        )
        await db.transactions.insert_one(transaction.dict())
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))