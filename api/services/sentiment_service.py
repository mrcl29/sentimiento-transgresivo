from pysentimiento import create_analyzer
from typing import Dict

class SentimentService:
    """Clase encargada de la lógica de procesamiento de sentimientos con pysentimiento."""

    def __init__(self, lang: str = "es"):
        self.analyzer = create_analyzer(task="sentiment", lang=lang)

    def analyze(self, text: str) -> Dict:
        """Realiza la predicción y formatea el resultado."""
        result = self.analyzer.predict(text)
        return {
            "output": result.probas,
            "label": result.output,
            "score": result.probas.get("POS", 0) # Añadido por compatibilidad si es necesario
        }
