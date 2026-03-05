import os
import redis
from typing import Optional

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)

class RedisCache:
    def __init__(self):
        self.client = redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            db=REDIS_DB,
            password=REDIS_PASSWORD,
            decode_responses=True
        )

    def set(self, key: str, value: str, expire: Optional[int] = None):
        self.client.set(key, value, ex=expire)

    def get(self, key: str) -> Optional[str]:
        return self.client.get(key)

    def delete(self, key: str):
        self.client.delete(key)

# Global singleton
cache = RedisCache()
