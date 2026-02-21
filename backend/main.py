from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import inventory
from database import client # Assuming you moved your client here
from fastapi import HTTPException, status
from models import LoginRequest
app = FastAPI(title="Warehouse API")

# 1. CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Database Connection Events
@app.on_event("startup")
async def startup_db_client():
    try:
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas!")
    except Exception as e:
        print(f"❌ Could not connect to MongoDB: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# 3. Include Routers
# Note: If inventory.py uses @router.get("/products"), 
# this will make it available at /api/products
app.include_router(inventory.router, prefix="/api", tags=["inventory"])

@app.get("/")
async def root():
    return {
        "message": "Warehouse Backend is running",
        "docs": "/docs",
        "status": "online"
    }
@app.post("/api/login")
async def login(data: LoginRequest):
    # In a real app, you'd verify hashed passwords from MongoDB
    if data.username == "admin@gmail.com" and data.password == "bushi1234":
        return {"token": "fake-jwt-token", "status": "success"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )