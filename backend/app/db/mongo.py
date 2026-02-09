from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None

db = MongoDB()

async def get_mongo_db():
    if db.client is None:
        db.client = AsyncIOMotorClient(settings.MONGO_URL)
    return db.client["college_erp"]
