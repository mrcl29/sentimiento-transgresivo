from fastapi import HTTPException
from services.genius_service import GeniusService
from services.lyrics_ovh_service import LyricsOvhService

class UnifiedLyricsService:
    def __init__(self):
        self.genius_service = GeniusService()
        self.ovh_service = LyricsOvhService()

    async def get_lyrics(self, song: str, artist: str = ""):
        lyrics = None

        # Intentamos primero con OVH si tenemos el artista
        if artist:
            try:
                lyrics = await self.ovh_service.get_lyrics(song, artist)
            except Exception as e:
                print(f"OVH fallback triggered due to: {e}")
                lyrics = None

        # Fallback a Genius si OVH falló o si no teníamos artista
        if not lyrics:
            try:
                lyrics = await self.genius_service.get_lyrics(song, artist)
            except Exception as e:
                raise HTTPException(status_code=404, detail="Lyrics not found in any service")

        return lyrics
