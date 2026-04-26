import io
import asyncio
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from wordcloud import WordCloud

router = APIRouter()

class WordCloudRequest(BaseModel):
    text: str

stopwords_es = set([
    # Artículos, preposiciones y conjunciones básicas
    'que', 'de', 'y', 'la', 'el', 'en', 'a', 'no', 'los', 'se', 'me', 'un', 'las',
    'por', 'con', 'para', 'una', 'lo', 'como', 'te', 'mi', 'pero', 'si', 'su', 'o',
    'tu', 'ya', 'del', 'al', 'es', 'qué', 'ha', 'son', 'ay', 'he', 'má', 'más',
    'hasta', 'hay', 'mis', 'ni', 'sin', 'sobre', 'entre', 'desde', 'hacia', 'contra',
    'porque', 'aunque', 'pues', 'sino', 'ante', 'tras',

    # Pronombres personales y posesivos
    'yo', 'tú', 'tu', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'ellas',
    'nos', 'os', 'les', 'le', 'sus', 'mío', 'mía', 'tuyo', 'tuya', 'suyo', 'suya',
    'nuestro', 'nuestra', 'esto', 'eso', 'aquello', 'esta', 'esa', 'este', 'ese',

    # Verbos auxiliares y ultra-comunes
    'soy', 'eres', 'somos', 'sois', 'fui', 'fue', 'era', 'eran', 'ser', 'siendo',
    'estoy', 'estás', 'está', 'estamos', 'están', 'estar', 'estaba', 'estaban',
    'has', 'han', 'hemos', 'había', 'haber', 'hubo',
    'voy', 'vas', 'va', 'vamos', 'van', 'ir', 'iba',
    'tengo', 'tienes', 'tiene', 'tenemos', 'tienen', 'tener', 'tenía',
    'hago', 'haces', 'hace', 'hacemos', 'hacen', 'hacer', 'hacía',
    'sé', 'sabes', 'sabe', 'sabemos', 'saben', 'saber',
    'quiero', 'quieres', 'quiere', 'queremos', 'quieren',

    # Adverbios y palabras de cantidad/tiempo/espacio
    'muy', 'mucho', 'mucha', 'muchos', 'muchas', 'poco', 'poca', 'nada', 'todo',
    'toda', 'todos', 'todas', 'algo', 'alguien', 'nadie', 'siempre', 'nunca', 'jamás',
    'hoy', 'ayer', 'mañana', 'ahora', 'antes', 'después', 'luego', 'entonces',
    'aquí', 'ahí', 'allí', 'acá', 'allá', 'cerca', 'lejos',
    'bien', 'mal', 'así', 'tan', 'tanto', 'solo', 'sólo', 'cuando', 'cuándo',
    'donde', 'dónde', 'como', 'cómo', 'quien', 'quién', 'cual', 'cuál',

    # Expresiones, onomatopeyas y estructura de canciones
    'oh', 'ah', 'eh', 'uh', 'na', 'yeah', 'bis', 'coro', 'estribillo', 'intro',
    'outro', 'guitarra', 'voz', 'instrumental', 'pa', 'pal',

    'ti', 'mí', 'sí', 'conmigo', 'contigo', 'consigo'
])

def generate_wordcloud_image(text: str) -> bytes:
    if not text.strip():
        raise ValueError("El texto está vacío")

    wc = WordCloud(
        width=800,
        height=400,
        background_color='black',
        colormap='Reds',
        stopwords=stopwords_es,
        max_words=100
    )
    
    wc.generate(text)
    
    # Exportar la imagen
    img = wc.to_image()
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    
    return buf.getvalue()

@router.post("")
async def create_wordcloud(request: WordCloudRequest):
    try:
        # Ejecutar la generación en un thread separado para no bloquear el Event Loop
        image_bytes = await asyncio.to_thread(generate_wordcloud_image, request.text)
        return Response(content=image_bytes, media_type="image/png")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al generar nube de palabras")
