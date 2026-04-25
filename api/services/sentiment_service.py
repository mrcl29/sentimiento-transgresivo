from sentiment_analysis_spanish import sentiment_analysis
from typing import Dict

class SentimentService:
    """Clase encargada de la lógica de procesamiento de sentimientos con sentiment-analysis-spanish."""

    def __init__(self):
        self.analyzer = sentiment_analysis.SentimentAnalysisSpanish()

    def analyze(self, text: str) -> Dict:
        """Realiza la predicción y formatea el resultado."""
        score = self.analyzer.sentiment(text)
        
        # El score es un float de 0 a 1.
        # Definimos etiquetas simples en función del score:
        if score > 0.55:
            label = "POS"
        elif score < 0.45:
            label = "NEG"
        else:
            label = "NEU"

        # Adaptamos el output al formato que esperaba el frontend
        return {
            "output": {
                "POS": score if label == "POS" else (1 - score) / 2,
                "NEG": (1 - score) if label == "NEG" else (1 - score) / 2,
                "NEU": 1 - abs(score - 0.5) * 2 if label == "NEU" else 0.1
            },
            "label": label,
            "score": score
        }
