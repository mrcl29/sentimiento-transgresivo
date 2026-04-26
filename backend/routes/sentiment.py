from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from httpx import HTTPStatusError
from services.sentiment_service import SentimentService

router = APIRouter()

class LyricRequest(BaseModel):
    """Modelo de datos para validar la solicitud entrante."""
    text: str = Field(..., min_length=1, description="Texto a analizar")

def get_sentiment_service() -> SentimentService:
    return SentimentService()

@router.post("/analyze")
async def analyze_sentiment(
    request: LyricRequest,
    service: SentimentService = Depends(get_sentiment_service)
):
    """
    Endpoint para analizar el sentimiento de un texto asíncronamente.
    """
    try:
        result = await service.analyze(request.text)
        return result

    except HTTPStatusError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Error comunicándose con Hugging Face: {e.response.status_code}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")
