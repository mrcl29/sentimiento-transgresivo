import os
from typing import Dict, Any
from fastapi import HTTPException
from huggingface_hub import AsyncInferenceClient

class SentimentService:
    def __init__(self):
        self.model_id = "nlptown/bert-base-multilingual-uncased-sentiment"

        raw_token = os.getenv("HF_TOKEN", "")
        hf_token = raw_token.strip().strip('"').strip("'")

        if not hf_token:
            raise ValueError("La variable de entorno HF_TOKEN no está configurada.")

        self.client = AsyncInferenceClient(model=self.model_id, token=hf_token)

    async def analyze(self, text: str) -> Dict[str, Any]:
        try:
            results = await self.client.text_classification(text)

            probas = {"POS": 0.0, "NEU": 0.0, "NEG": 0.0}

            for item in results:
                label = item.label
                score = item.score

                if label in ["1 star", "2 stars"]:
                    probas["NEG"] += score
                elif label == "3 stars":
                    probas["NEU"] += score
                elif label in ["4 stars", "5 stars"]:
                    probas["POS"] += score

            best_label = max(probas, key=probas.get)

            return {
                "output": probas,
                "label": best_label,
                "score": probas.get("POS", 0.0)
            }

        except Exception as e:
            print(f"Error interno del SDK de HF: {str(e)}")
            raise HTTPException(
                status_code=502,
                detail=f"Error del servicio de IA: {str(e)}"
            )
