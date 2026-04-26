from fastapi import APIRouter, Query
from ..services.genius_service import GeniusService

router = APIRouter()
genius_service = GeniusService()

@router.get("/search")
async def search_genius(q: str = Query(..., description="Término de búsqueda en Genius")):
    """
    Endpoint para buscar canciones o artistas en Genius.
    """
    return await genius_service.search(q)

@router.get("/lyrics")
async def get_lyrics(
    song: str = Query(..., description="Título de la canción"),
    artist: str = Query("", description="Nombre del artista (opcional)")
):
    """
    Endpoint para obtener la letra de una canción desde Genius.
    """
    lyrics = await genius_service.get_lyrics(song, artist)
    return {"lyrics": lyrics}
