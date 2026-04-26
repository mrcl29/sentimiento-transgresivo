import io
import asyncio
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

router = APIRouter()

class SentimentPoint(BaseModel):
    album_name: str
    prob_negativa: float

class ViolinPlotRequest(BaseModel):
    data: List[SentimentPoint]

def generate_violin_image(points: List[SentimentPoint]) -> bytes:
    if not points:
        raise ValueError("No hay datos para generar el gráfico")

    df = pd.DataFrame([p.dict() for p in points])

    # Fondo oscuro
    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=(10, 6))
    fig.patch.set_facecolor('#0c0a09') # stone-950
    ax.set_facecolor('#0c0a09')

    # Violín
    sns.violinplot(
        data=df,
        x='album_name',
        y='prob_negativa',
        inner="quartile",
        palette='husl',
        ax=ax,
        linewidth=1
    )

    # Puntos sobre el violín
    sns.stripplot(
        data=df,
        x='album_name',
        y='prob_negativa',
        color='white',
        alpha=0.5,
        jitter=True,
        ax=ax,
        size=6
    )

    ax.set_title('Comparativa de Sentimiento Negativo', fontsize=14, color='white', pad=20)
    ax.set_ylabel('Probabilidad de sentimiento Negativo (0 a 1)', color='#a8a29e') # stone-400
    ax.set_xlabel('Álbum', color='#a8a29e', labelpad=10)
    ax.set_ylim(-0.1, 1.1)

    ax.axhline(0.5, color='#ef4444', linestyle='--', alpha=0.5, label='Umbral 50%')
    ax.legend(facecolor='#1c1917', edgecolor='#44403c', labelcolor='white')

    # Ajustar color de ejes
    ax.tick_params(colors='#78716c') # stone-500
    for spine in ['bottom', 'left']:
        ax.spines[spine].set_color('#44403c') # stone-700
    for spine in ['top', 'right']:
        ax.spines[spine].set_visible(False)

    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format='png', facecolor=fig.get_facecolor(), edgecolor='none', dpi=150)
    buf.seek(0)
    plt.close('all')
    
    return buf.getvalue()

@router.post("")
async def create_violinplot(request: ViolinPlotRequest):
    try:
        image_bytes = await asyncio.to_thread(generate_violin_image, request.data)
        return Response(content=image_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
