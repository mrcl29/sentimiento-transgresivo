from fastapi import FastAPI
from .routes import sentiment, genius, lyrics

app = FastAPI(title="Lyric Analysis API")

app.include_router(sentiment.router, prefix="/api", tags=["sentiment"])
app.include_router(genius.router, prefix="/api/genius", tags=["genius"])
app.include_router(lyrics.router, prefix="/api/lyrics", tags=["lyrics"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
