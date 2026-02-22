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
        # 1. Calculate the adjustment (Negative if OUT, Positive if IN)
        adjustment = transaction.quantity if transaction.type == "IN" else -transaction.quantity

        # 2. Update the product stock using the adjustment
        await db.products.update_one(
            {"name": transaction.product_name},
            {
                "$inc": {"current_stock": adjustment}, # Uses the new variable
                "$setOnInsert": {"category": "General"}
            },
            upsert=True
        )
        
        # 3. Save the transaction log
        await db.transactions.insert_one(transaction.dict())
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))