from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from ..services.sentiment_service import SentimentService

router = APIRouter()
service = None

class LyricRequest(BaseModel):
    """Modelo de datos para la solicitud de análisis."""
    text: str = Field(..., min_length=1, description="Texto a analizar")

@router.post("/analyze")
async def analyze_sentiment(request: LyricRequest):
    """
    Endpoint para analizar el sentimiento de un texto.
    """
    global service
    try:
        if service is None:
            service = SentimentService()

        return service.analyze(request.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el análisis: {str(e)}")
