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
        # Debug: See what is coming from the frontend in your terminal
        print(f"Received: {transaction.product_name}, Qty: {transaction.quantity}, Type: {transaction.type}")

        # 1. Calculate the adjustment
        adjustment = transaction.quantity if transaction.type == "IN" else -transaction.quantity

        # 2. Update the product stock
        # NOTE: If current_stock in your DB is a string "10", this WILL fail.
        # It must be a number 10.
        update_result = await db.products.update_one(
            {"name": transaction.product_name},
            {
                "$inc": {"current_stock": adjustment},
                "$setOnInsert": {"category": "General"}
            },
            upsert=True
        )
        
        # 3. Save the transaction log (converting model to dict)
        transaction_data = transaction.dict()
        transaction_data["timestamp"] = datetime.utcnow() # Good for NUML project logs
        
        await db.transactions.insert_one(transaction_data)
        
        return {"status": "success"}
    except Exception as e:
        print(f"❌ Transaction Error: {str(e)}") # This shows the EXACT error in your terminal
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")