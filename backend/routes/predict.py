import os
import joblib
from fastapi import APIRouter, Query
from services.predict_service import PredictService

# Cargar el modelo una sola vez al iniciar la aplicación
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "data", "robe_iniesta_modelo_821a96c1.joblib")

model = joblib.load(MODEL_PATH)

router = APIRouter()
# Inicializar el servicio con el modelo cargado
predict_service = PredictService(model)

@router.get("")
async def get_predict_text(
    text: str = Query(..., description="Texto a Predecir")
):
    """
    Endpoint para ejecutar el modelo predictivo sobre un texto.
    Indica si el texto podría haber sido dicho o compuesto por Robe Iniesta.
    """
    is_match, probability = await predict_service.predict_text(text)
    return {"is_match": is_match, "probability": probability}
