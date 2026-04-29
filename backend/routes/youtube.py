from fastapi import APIRouter, Query, HTTPException
from services.youtube_service import YouTubeService

router = APIRouter(tags=["youtube"])
youtube_service = YouTubeService()

@router.get("/iframe")
async def get_youtube_iframe(
    song: str = Query(..., description="Nombre de la canción"),
    artist: str = Query("", description="Nombre del artista")
):
    try:
        iframe_url = await youtube_service.get_track_iframe(song, artist)
        return {"iframe_url": iframe_url}
    except HTTPException as e:
        raise e
    except Exception as e:
        import traceback
        error_msg = f"Error inesperado: {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)
