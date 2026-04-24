from fastapi import FastAPI
from pydantic import BaseModel
from pysentimiento import create_analyzer

app = FastAPI()
analyzer = create_analyzer(task="sentiment", lang="es")

class LyricRequest(BaseModel):
    text: str

@app.post("/analyze")
async def analyze_sentiment(request: LyricRequest):
    result = analyzer.predict(request.text)
    return {
        "output": result.probas, # Devuelve las probabilidades pos/neg/neu
        "label": result.output
    }
