import os
import httpx
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

class GeniusService:
    def __init__(self):
        self.token = os.getenv("GENIUS_ACCESS_TOKEN")
        self.base_url = "https://api.genius.com"
        
        if not self.token:
            print("Warning: GENIUS_ACCESS_TOKEN not found in environment")

    async def search(self, query: str):
        if not self.token:
            raise HTTPException(status_code=500, detail="Genius API token not configured")
            
        headers = {
            "Authorization": f"Bearer {self.token}"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/search", params={"q": query}, headers=headers)
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Error fetching from Genius API")
                
            return response.json()
