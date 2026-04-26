import httpx
from fastapi import HTTPException

class LyricsOvhService:
    def __init__(self):
        self.base_url = "https://api.lyrics.ovh/v1"

    async def get_lyrics(self, song: str, artist: str):
        if not artist or not song:
            raise HTTPException(status_code=400, detail="Lyrics.ovh requires both artist and song")

        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/{artist}/{song}")
            
            if response.status_code == 200:
                data = response.json()
                return data.get("lyrics", "")
            else:
                raise HTTPException(status_code=response.status_code, detail="Lyrics not found in OVH")
