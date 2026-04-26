import os
import httpx
from fastapi import HTTPException
from dotenv import load_dotenv
import lyricsgenius as genius

load_dotenv()

class GeniusService:
    def __init__(self):
        self.token = os.getenv("GENIUS_ACCESS_TOKEN")
        self.base_url = "https://api.genius.com"
        self.genius = genius.Genius(self.token)

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

    async def get_lyrics(self, song_title: str, artist: str = ""):
        import asyncio
        if not self.token:
            raise HTTPException(status_code=500, detail="Genius API token not configured")

        # lyricsgenius es síncrono, por lo que bloquea el event loop.
        # Lo envolvemos en asyncio.to_thread para que FastAPI siga siendo asíncrono.
        if artist:
            song_result = await asyncio.to_thread(self.genius.search_song, song_title, artist=artist)
        else:
            song_result = await asyncio.to_thread(self.genius.search_song, song_title)

        if song_result:
            return song_result.lyrics
        else:
            raise HTTPException(status_code=404, detail="Song not found")
