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
        # 1. If it's a Stock Out, check if we have enough
        if transaction.type == "OUT":
            product = await db.products.find_one({"name": transaction.product_name})
            
            # If product doesn't exist or stock is less than requested quantity
            current_stock = product.get("current_stock", 0) if product else 0
            if current_stock < transaction.quantity:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Insufficient stock. Current: {current_stock}, Requested: {transaction.quantity}"
                )

        # 2. Calculate the adjustment
        adjustment = transaction.quantity if transaction.type == "IN" else -transaction.quantity

        # 3. Update the product stock
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
        
    except HTTPException as he:
        raise he # Re-raise the 400 error for insufficient stock
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))