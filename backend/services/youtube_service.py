import os
import httpx
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

class YouTubeService:
    def __init__(self):
        self.api_key = os.getenv("YOUTUBE_API_KEY")
        self.search_url = "https://www.googleapis.com/youtube/v3/search"

    async def search_video(self, query: str, artist: str = ""):
        """Busca un video en YouTube y devuelve el videoId del mejor resultado."""
        if not self.api_key:
            print("ERROR: YOUTUBE_API_KEY no encontrada en variables de entorno")
            raise HTTPException(status_code=500, detail="YouTube API Key not configured")

        print(f"Buscando en YouTube: {query}")
        params = {
            "part": "snippet",
            "q": query,
            "type": "video",
            "key": self.api_key,
            "maxResults": 5
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(self.search_url, params=params)

            if response.status_code != 200:
                print(f"Error de YouTube API ({response.status_code}): {response.text}")
                raise HTTPException(status_code=response.status_code, detail=f"Error searching YouTube: {response.text}")

            data = response.json()
            items = data.get("items", [])

            if not items:
                raise HTTPException(status_code=404, detail="No videos found on YouTube for the given query")

            # Priorización del artista
            best_match = items[0]
            if artist:
                artist_lower = artist.lower()
                for item in items:
                    title = item["snippet"]["title"].lower()
                    channel_title = item["snippet"]["channelTitle"].lower()
                    # Si el artista está en el nombre del canal o en el título, es muy probable que sea el oficial
                    if artist_lower in channel_title or artist_lower in title:
                        best_match = item
                        break

            return best_match["id"]["videoId"]

    def get_iframe_url(self, video_id: str):
        """Genera la URL para el iframe embebido de YouTube."""
        # rel=0 evita mostrar videos relacionados al final que no sean del mismo canal
        return f"https://www.youtube.com/embed/{video_id}?autoplay=0&rel=0&modestbranding=1"

    async def get_track_iframe(self, track_name: str, artist: str = ""):
        """Función principal que combina búsqueda y generación de iframe."""
        query = f"{track_name} {artist} official audio".strip()
        video_id = await self.search_video(query, artist)
        return self.get_iframe_url(video_id)
