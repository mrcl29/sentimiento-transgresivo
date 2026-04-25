import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

from .index import app
from .services.sentiment_service import SentimentService
from .services.genius_service import GeniusService

client = TestClient(app)

def test_sentiment_service_positive():
    """Verifica que el servicio detecte sentimientos positivos."""
    svc = SentimentService()
    result = svc.analyze("Hoy es un día maravilloso y me siento genial")
    assert "POS" in result["label"]
    assert result["output"]["POS"] > 0.5

def test_sentiment_endpoint():
    """Verifica el endpoint POST /api/analyze."""
    response = client.post(
        "/api/analyze",
        json={"text": "Esto es algo terrible y muy malo"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "label" in data
    assert "NEG" in data["label"]

@pytest.mark.asyncio
async def test_genius_service_search():
    """Verifica el servicio GeniusService haciendo mock de httpx."""
    svc = GeniusService()
    svc.token = "fake_token"  # Aseguramos que haya token para que no salte excepción
    
    mock_response_data = {"meta": {"status": 200}, "response": {"hits": []}}
    
    class MockResponse:
        status_code = 200
        def json(self):
            return mock_response_data

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = MockResponse()
        
        result = await svc.search("Extremoduro")
        
        assert result == mock_response_data
        mock_get.assert_called_once()
        args, kwargs = mock_get.call_args
        assert "api.genius.com/search" in args[0]
        assert kwargs["params"]["q"] == "Extremoduro"
        assert "fake_token" in kwargs["headers"]["Authorization"]

def test_genius_endpoint():
    """Verifica el endpoint GET /api/genius/search."""
    mock_response_data = {"meta": {"status": 200}, "response": {"hits": [{"result": {"title": "Jesucristo García"}}]}}

    with patch("api.services.genius_service.GeniusService.search", new_callable=AsyncMock) as mock_search:
        mock_search.return_value = mock_response_data

        response = client.get("/api/genius/search?q=Extremoduro")

        assert response.status_code == 200
        assert response.json() == mock_response_data
        mock_search.assert_called_once_with("Extremoduro")
