'use client'

import type { Track } from '@/app/_types'

interface SoundCloudModalProps {
    track: Track
    isAnimating: boolean
    iframeUrl: string | null
    isLoading: boolean
    onClose: () => void
}

export default function SoundCloudModal({
    track,
    isAnimating,
    iframeUrl,
    isLoading,
    onClose,
}: SoundCloudModalProps) {
    return (
        <div
            className={`fixed inset-0 z-[70] flex items-center justify-center bg-stone-950/90 backdrop-blur-sm p-4 transition-opacity duration-300 ${
                isAnimating ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={onClose}
        >
            <div
                className={`bg-stone-900 border border-stone-700 w-[95vw] max-w-xl transition-all duration-500 ease-out transform shadow-2xl rounded-sm overflow-hidden ${
                    isAnimating ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabecera */}
                <div className="bg-stone-950 border-b border-stone-800 p-4 flex justify-between items-center shrink-0">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-black text-stone-50 uppercase tracking-tighter truncate max-w-[300px]">
                            {track.track_name}
                        </h2>
                        <span className="text-red-600 text-xs font-bold uppercase tracking-widest">
                            Reproduciendo en SoundCloud
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-stone-800 text-stone-50 font-bold px-3 py-1.5 uppercase hover:bg-stone-700 transition-all rounded-sm text-xs cursor-pointer"
                    >
                        Cerrar
                    </button>
                </div>

                {/* Reproductor */}
                <div className="aspect-video w-full bg-stone-950 flex items-center justify-center relative">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-stone-500 font-bold uppercase tracking-widest text-xs">
                                Buscando en SoundCloud...
                            </span>
                        </div>
                    ) : iframeUrl ? (
                        <iframe
                            width="100%"
                            height="100%"
                            scrolling="no"
                            frameBorder="no"
                            allow="autoplay"
                            src={iframeUrl}
                        />
                    ) : (
                        <div className="text-red-500 font-bold p-8 text-center">
                            No se pudo encontrar la canción en SoundCloud.
                        </div>
                    )}
                </div>
                
                {/* Footer decorativo brutalista */}
                <div className="h-1 bg-red-600 w-full" />
            </div>
        </div>
    )
}
