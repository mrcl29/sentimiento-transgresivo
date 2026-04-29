import os
import httpx
from fastapi import HTTPException
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

class SoundCloudService:
    def __init__(self):
        self.client_id = os.getenv("SOUNDCLOUD_CLIENT_ID")
        self.client_secret = os.getenv("SOUNDCLOUD_CLIENT_SECRET")
        self.token_url = "https://secure.soundcloud.com/oauth/token"
        self.api_url = "https://api.soundcloud.com"
        self._access_token = None

    async def get_access_token(self, force_refresh: bool = False):
        """Obtiene el token de acceso usando client credentials con Basic Auth."""
        if self._access_token and not force_refresh:
            return self._access_token

        if not self.client_id or not self.client_secret:
            raise HTTPException(status_code=500, detail="SoundCloud credentials not configured")

        import base64
        auth_str = f"{self.client_id}:{self.client_secret}"
        encoded_auth = base64.b64encode(auth_str.encode()).decode()
        
        headers = {
            "Authorization": f"Basic {encoded_auth}"
        }
        data = {
            "grant_type": "client_credentials"
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(self.token_url, data=data, headers=headers)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=f"Error obtaining SoundCloud token: {response.text}")

            token_data = response.json()
            self._access_token = token_data.get("access_token")
            return self._access_token

    async def search_track(self, query: str, artist: str = "", retry: bool = True):
        """Busca una canción en SoundCloud y devuelve la URL del resultado que mejor coincida con el artista."""
        token = await self.get_access_token()

        headers = {
            "Authorization": f"Bearer {token}"
        }

        params = {
            "q": query,
            "limit": 5  # Buscamos varios para filtrar por artista
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.api_url}/tracks", params=params, headers=headers)

            # Si el token ha expirado (401), intentamos refrescarlo y reintentar la petición una vez.
            if response.status_code == 401 and retry:
                await self.get_access_token(force_refresh=True)
                return await self.search_track(query, artist, retry=False)

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=f"Error searching track on SoundCloud: {response.text}")

            tracks = response.json()
            if not tracks:
                raise HTTPException(status_code=404, detail="No tracks found on SoundCloud for the given query")

            # Priorizar el artista original
            best_match = tracks[0]
            if artist:
                artist_lower = artist.lower()
                for track in tracks:
                    user_name = track.get("user", {}).get("username", "").lower()
                    title = track.get("title", "").lower()
                    # Si el nombre del artista está en el usuario o en el título, es más probable que sea el original
                    if artist_lower in user_name or artist_lower in title:
                        best_match = track
                        break

            return best_match["permalink_url"]

    def get_iframe_url(self, track_url: str):
        """Genera la URL para el iframe embebido a partir de la URL del track."""
        encoded_url = quote_plus(track_url)

        # Parámetros de configuración del reproductor de SoundCloud.
        player_params = {
            "color": "d50000",
            "auto_play": "false",
            "hide_related": "true",
            "show_comments": "true",
            "show_user": "true",
            "show_reposts": "false",
            "show_teaser": "true",
            "visual": "false",
            "buying": "false",
            "sharing": "false",
            "download": "false",
            "show_artwork": "true",
            "show_playcount": "true",
            "single_active": "false",
        }

        query_string = "&amp;".join([f"{key}={value}" for key, value in player_params.items()])

        src_url = f"https://w.soundcloud.com/player/?url={encoded_url}&amp;{query_string}"

        return src_url

    async def get_track_iframe(self, track_name: str, artist: str = ""):
        """Función principal que combina búsqueda y generación de iframe."""
        query = f"{track_name} {artist}".strip()
        track_url = await self.search_track(query, artist)
        return self.get_iframe_url(track_url)
