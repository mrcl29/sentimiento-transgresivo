import os
import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

from index import app
from services.sentiment_service import SentimentService
from services.genius_service import GeniusService
from services.lyrics_ovh_service import LyricsOvhService
from services.lyrics_service import UnifiedLyricsService

client = TestClient(app)

@pytest.mark.asyncio
@patch.dict(os.environ, {"HF_TOKEN": "fake_test_token"})
async def test_sentiment_service_positive():
    """
    Verifica que el servicio detecte sentimientos positivos.
    Simula la respuesta de la API de Hugging Face usando AsyncMock.
    """
    svc = SentimentService()

    mock_hf_response = [
        [
            {"label": "POS", "score": 0.95},
            {"label": "NEG", "score": 0.03},
            {"label": "NEU", "score": 0.02}
        ]
    ]

    class MockResponse:
        def raise_for_status(self):
            pass
        def json(self):
            return mock_hf_response

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = MockResponse()

        result = await svc.analyze("Hoy es un día maravilloso y me siento genial")

        assert result["label"] == "POS"
        assert result["score"] == 0.95
        assert result["output"]["POS"] == 0.95
        mock_post.assert_called_once()


def test_sentiment_endpoint():
    """
    Verifica el endpoint POST /api/analyze.
    Hacemos mock del servicio completo para aislar la prueba del enrutador.
    """
    mock_service_response = {
        "output": {"POS": 0.1, "NEG": 0.8, "NEU": 0.1},
        "label": "NEG",
        "score": 0.1
    }

    with patch("api.services.sentiment_service.SentimentService.analyze", new_callable=AsyncMock) as mock_analyze:
        mock_analyze.return_value = mock_service_response

        response = client.post(
            "/api/analyze",
            json={"text": "Esto es algo terrible y muy malo"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["label"] == "NEG"
        mock_analyze.assert_called_once_with("Esto es algo terrible y muy malo")

@pytest.mark.asyncio
async def test_genius_service_search():
    """Verifica el servicio GeniusService haciendo mock de httpx."""
    svc = GeniusService()
    svc.token = "fake_token"

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

@pytest.mark.asyncio
async def test_genius_service_get_lyrics():
    """Verifica el método get_lyrics haciendo mock de lyricsgenius."""
    svc = GeniusService()
    svc.token = "fake_token"

    class MockSong:
        def __init__(self, lyrics):
            self.lyrics = lyrics

    with patch("lyricsgenius.Genius.search_song") as mock_search_song:
        mock_search_song.return_value = MockSong("La hoguera de los continentes")

        lyrics = await svc.get_lyrics("La hoguera", artist="Extremoduro")

        assert lyrics == "La hoguera de los continentes"
        mock_search_song.assert_called_once_with("La hoguera", artist="Extremoduro")

def test_genius_endpoint_lyrics():
    """Verifica el endpoint GET /api/genius/lyrics."""
    with patch("api.services.genius_service.GeniusService.get_lyrics", new_callable=AsyncMock) as mock_get_lyrics:
        mock_get_lyrics.return_value = "La letra de la canción"

        response = client.get("/api/genius/lyrics?song=Jesucristo%20García&artist=Extremoduro")

        assert response.status_code == 200
        assert response.json() == {"lyrics": "La letra de la canción"}
        mock_get_lyrics.assert_called_once_with("Jesucristo García", "Extremoduro")

@pytest.mark.asyncio
async def test_lyrics_ovh_service_success():
    """Verifica el servicio LyricsOvhService haciendo mock de httpx (caso éxito)."""
    svc = LyricsOvhService()
    mock_response_data = {"lyrics": "Letra de prueba OVH"}

    class MockResponse:
        status_code = 200
        def json(self):
            return mock_response_data

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = MockResponse()

        lyrics = await svc.get_lyrics("Jesucristo García", "Extremoduro")

        assert lyrics == "Letra de prueba OVH"
        mock_get.assert_called_once()

@pytest.mark.asyncio
async def test_unified_lyrics_service_fallback():
    """Verifica el fallback de OVH a Genius en UnifiedLyricsService."""
    svc = UnifiedLyricsService()

    with patch("api.services.lyrics_ovh_service.LyricsOvhService.get_lyrics", new_callable=AsyncMock) as mock_ovh:
        with patch("api.services.genius_service.GeniusService.get_lyrics", new_callable=AsyncMock) as mock_genius:
            # Simulamos que OVH falla
            mock_ovh.side_effect = Exception("OVH Error")
            mock_genius.return_value = "Letra de prueba Genius"

            lyrics = await svc.get_lyrics("La vereda de la puerta de atrás", "Extremoduro")

            assert lyrics == "Letra de prueba Genius"
            mock_ovh.assert_called_once()
            mock_genius.assert_called_once()

def test_generic_lyrics_endpoint():
    """Verifica el endpoint GET /api/lyrics/."""
    with patch("api.services.lyrics_service.UnifiedLyricsService.get_lyrics", new_callable=AsyncMock) as mock_get_lyrics:
        mock_get_lyrics.return_value = "Letra unificada"

        response = client.get("/api/lyrics/?song=Standby&artist=Extremoduro")

        assert response.status_code == 200
        assert response.json() == {"lyrics": "Letra unificada"}
        mock_get_lyrics.assert_called_once_with("Standby", "Extremoduro")

def test_wordcloud_endpoint():
    """Verifica el endpoint POST /api/wordcloud."""
    response = client.post(
        "/api/wordcloud",
        json={"text": "Extremoduro robe robe robe amor rock"}
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert response.content.startswith(b'\x89PNG')

def test_wordcloud_endpoint_empty():
    """Verifica el endpoint POST /api/wordcloud con texto vacío."""
    response = client.post(
        "/api/wordcloud",
        json={"text": "   "}
    )
    assert response.status_code == 400
    assert "vacío" in response.json()["detail"]
