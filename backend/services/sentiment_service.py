import os
import httpx
from typing import Dict, Any

class SentimentService:
    """
    Servicio de análisis de sentimientos utilizando la API de Inferencia de Hugging Face.
    Sigue el principio de Responsabilidad Única (SRP) aislando la lógica HTTP.
    """

    def __init__(self):
        self.api_url = "https://api-inference.huggingface.co/models/pysentimiento/robertuito-sentiment-analysis"

        hf_token = os.getenv("HF_TOKEN")
        if not hf_token:
            raise ValueError("La variable de entorno HF_TOKEN no está configurada.")

        self.headers = {"Authorization": f"Bearer {hf_token}"}

    async def analyze(self, text: str) -> Dict[str, Any]:
        """
        Envía el texto a Hugging Face y formatea la respuesta.

        Args:
            text (str): Texto a analizar.

        Returns:
            Dict[str, Any]: Diccionario con las probabilidades y la etiqueta ganadora.
        """
        payload = {"inputs": text}

        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.api_url,
                headers=self.headers,
                json=payload,
                timeout=15.0
            )

            response.raise_for_status()

            data = response.json()[0]

            probas = {item['label']: item['score'] for item in data}

            best_label = max(probas, key=probas.get)

            return {
                "output": probas,
                "label": best_label,
                "score": probas.get("POS", 0)
            }
