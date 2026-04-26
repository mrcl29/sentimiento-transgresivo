from fastapi import FastAPI
from .routes import sentiment, genius, lyrics, wordcloud, violinplot

app = FastAPI(title="Lyric Analysis API")

app.include_router(sentiment.router, prefix="/api", tags=["sentiment"])
app.include_router(wordcloud.router, prefix="/api/wordcloud", tags=["wordcloud"])
app.include_router(violinplot.router, prefix="/api/violinplot", tags=["violinplot"])
app.include_router(genius.router, prefix="/api/genius", tags=["genius"])
app.include_router(lyrics.router, prefix="/api/lyrics", tags=["lyrics"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
