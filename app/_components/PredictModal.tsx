'use client'

interface PredictModalProps {
  isOpen: boolean
  isAnimating: boolean
  text: string
  setText: (text: string) => void
  result: { is_match: boolean, probability: number } | null
  isLoading: boolean
  error: string | null
  onRun: (text: string) => void
  onClose: () => void
}

export default function PredictModal({
  isOpen,
  isAnimating,
  text,
  setText,
  result,
  isLoading,
  error,
  onRun,
  onClose,
}: PredictModalProps) {
  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-stone-950/95 backdrop-blur-md p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-stone-900 border-2 border-stone-700 w-full max-w-xl shadow-[20px_20px_0px_0px_rgba(153,27,27,0.4)] transition-all duration-500 ease-out transform ${
          isAnimating ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-12 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="bg-red-900 border-b-2 border-stone-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black text-stone-50 uppercase tracking-tighter">
            ¿Es esto de Robe?
          </h2>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white transition-colors p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="p-8 space-y-6">
          <p className="text-stone-400 font-serif italic text-lg">
            Introduce un verso o frase. Nuestro modelo entrenado con la discografía de Robe analizará si encaja con su estilo transgresivo.
          </p>
          
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ej: 'Ama, ama y ensancha el alma...'"
              className="w-full h-32 bg-stone-950 border-2 border-stone-700 p-4 text-stone-100 font-serif text-xl focus:border-red-600 focus:outline-none transition-colors resize-none placeholder:text-stone-700"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-800 p-4 text-red-400 font-bold text-sm">
              {error}
            </div>
          )}

          {result && !isLoading && (
            <div className={`p-6 border-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
              result.is_match ? 'bg-red-900/20 border-red-700' : 'bg-stone-800/50 border-stone-600'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-3 h-12 ${result.is_match ? 'bg-red-600' : 'bg-stone-500'}`} />
                <div>
                    <h3 className={`text-2xl font-black uppercase tracking-widest ${result.is_match ? 'text-red-500' : 'text-stone-400'}`}>
                    {result.is_match ? '¡PURO ROBE!' : 'Poco Transgresivo'}
                    </h3>
                    <p className="text-stone-300 font-mono text-lg mt-1">
                    Probabilidad de autoría: <span className="font-black text-stone-50">{result.probability.toFixed(1)}%</span>
                    </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => onRun(text)}
              disabled={isLoading || !text.trim()}
              className="group relative bg-red-600 hover:bg-red-500 text-white font-black py-4 px-10 uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Consultando al oráculo...
                  </>
                ) : (
                  'Analizar estilo'
                )}
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
