from fastapi import APIRouter, Query
from services.lyrics_service import UnifiedLyricsService

router = APIRouter()
lyrics_service = UnifiedLyricsService()

@router.get("")
async def get_generic_lyrics(
    song: str = Query(..., description="Título de la canción"),
    artist: str = Query("", description="Nombre del artista (opcional)")
):
    """
    Endpoint genérico para obtener la letra de una canción.
    Intenta primero usar lyrics.ovh y, como fallback, usa Genius.
    """
    lyrics = await lyrics_service.get_lyrics(song, artist)
    print(lyrics)
    return {"lyrics": lyrics}
