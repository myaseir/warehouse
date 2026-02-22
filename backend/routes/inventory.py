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
        # Now 'type' will exist because we added it to the model above
        adjustment = transaction.quantity if transaction.type == "IN" else -transaction.quantity

        await db.products.update_one(
            {"name": transaction.product_name},
            {
                "$inc": {"current_stock": adjustment},
                "$setOnInsert": {"category": "General"}
            },
            upsert=True
        )
        
        await db.transactions.insert_one(transaction.dict())
        return {"status": "success"}
    except Exception as e:
        # This will print the error to your terminal so you can see it
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))