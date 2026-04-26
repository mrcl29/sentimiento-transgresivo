'use client'

interface LegendProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Componente de leyenda para explicar las métricas musicales.
 * Diseño brutalista acorde al resto de la aplicación.
 */
export default function Legend({ isOpen, onClose }: LegendProps) {
  if (!isOpen) return null

  const metrics = [
    { name: 'Bailable', desc: 'Aptitud de la canción para bailar basada en el ritmo, estabilidad y fuerza del compás.' },
    { name: 'Energía', desc: 'Medida de intensidad y actividad. Las canciones enérgicas se sienten rápidas y ruidosas.' },
    { name: 'Valencia', desc: 'Positividad musical. Valores altos suenan alegres o eufóricos, bajos suenan tristes o enojados.' },
    { name: 'Acústica', desc: 'Confianza en que la pista es acústica. Un valor del 100% representa alta confianza.' },
    { name: 'Instrumental', desc: 'Indica si una pista contiene voces. Un valor del 100% indica que no contiene voces.' },
    { name: 'Directo', desc: 'Indica si la pista fue grabada en vivo. Valores altos indican alta confianza.' },
    { name: 'Hablado', desc: 'Indica si la pista contiene palabras habladas. Valores altos indican contenido no musical.' },
    { name: 'Tempo', desc: 'Velocidad estimada de la canción en pulsaciones por minuto (BPM).' },
    { name: 'Duración', desc: 'Longitud total de la canción en minutos y segundos.' },
  ]

  return (
    <div
      className="absolute right-0 top-full mt-2 z-50 w-80 bg-stone-900 border-2 border-red-800 p-5 shadow-[10px_10px_0px_0px_rgba(153,27,27,0.3)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4 border-b-2 border-red-900 pb-2">
        <h3 className="text-red-500 font-black uppercase tracking-tighter text-lg">Glosario de Métricas</h3>
        <button
          onClick={onClose}
          className="text-stone-500 hover:text-white transition-colors"
          title="Cerrar leyenda"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-900">
        {metrics.map((m) => (
          <div key={m.name} className="group">
            <span className="text-stone-100 font-bold text-xs uppercase tracking-widest border-l-2 border-red-600 pl-2 group-hover:bg-red-950/30 transition-colors block py-0.5">
              {m.name}
            </span>
            <p className="text-stone-400 text-xs mt-1 font-serif italic leading-relaxed">
              {m.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
