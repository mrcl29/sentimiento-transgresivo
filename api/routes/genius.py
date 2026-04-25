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
