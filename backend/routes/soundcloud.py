from fastapi import APIRouter, Query
from services.soundcloud_service import SoundCloudService

router = APIRouter()
soundcloud_service = SoundCloudService()

@router.get("/iframe")
async def get_soundcloud_iframe(
    song: str = Query(..., description="Título de la canción"),
    artist: str = Query("", description="Nombre del artista (opcional)")
):
    """
    Endpoint para obtener la URL del iframe de SoundCloud para una canción.
    """
    iframe_url = await soundcloud_service.get_track_iframe(song, artist)
    return {"iframe_url": iframe_url}
