from fastapi import HTTPException
import numpy as np

class PredictService:
    def __init__(self, model):
        self.model = model
        self.feature_extractor = model.named_steps['tfidf']

    async def predict_text(self, text: str):
        # Transformar el texto usando el extractor de características (TF-IDF)
        vector = self.feature_extractor.transform([text])

        # Si no hay palabras que coincidan con el vocabulario, probabilidad 0
        if vector.nnz == 0:
            return False, 0.0

        # Obtener probabilidades
        probabilities = self.model.predict_proba([text])[0]
        
        # Encontrar el índice de la clase '1' (Match con Robe)
        target_class_index = np.where(self.model.classes_ == 1)[0][0]
        probability_score = probabilities[target_class_index]

        is_match = bool(probability_score > 0.50)

        return is_match, float(probability_score * 100.0)
