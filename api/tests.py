import pytest
from .services.sentiment_service import SentimentService

def test_sentiment_service_positive():
    """Verifica que el servicio detecte sentimientos positivos."""
    svc = SentimentService()
    result = svc.analyze("Hoy es un día maravilloso y me siento genial")
    assert "POS" in result["label"]
    assert result["output"]["POS"] > 0.5
