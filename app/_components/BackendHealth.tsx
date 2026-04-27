'use client'

import { useEffect, useState, useCallback } from 'react'

/**
 * Componente que verifica el estado del backend en Render.com.
 * Debido a que Render duerme las instancias gratuitas, este componente
 * gestiona la espera de ~50s de activación.
 */
export default function BackendHealth() {
    const [status, setStatus] = useState<'active' | 'activating'>('activating')
    const [secondsRemaining, setSecondsRemaining] = useState(50)

    const checkHealth = useCallback(async () => {
        try {
            const res = await fetch('/api/health')
            if (res.ok) {
                const data = await res.json()
                if (data.status === 'ok') {
                    setStatus('active')
                }
            }
        } catch (error) {
            // Backend aún no responde (Cold Start)
            console.log('Backend despertando...')
        }
    }, [])

    useEffect(() => {
        // Primera comprobación
        checkHealth()

        // Polling cada 5 segundos si no está activo
        const interval = setInterval(() => {
            if (status !== 'active') {
                checkHealth()
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [status, checkHealth])

    // Contador visual para mejorar la UX durante la espera
    useEffect(() => {
        if (status === 'active' || secondsRemaining <= 0) return

        const timer = setInterval(() => {
            setSecondsRemaining((prev) => Math.max(0, prev - 1))
        }, 1000)

        return () => clearInterval(timer)
    }, [status, secondsRemaining])

    return (
        <div 
            className={`
                flex items-center gap-3 px-4 py-2 rounded-sm border-2 transition-all duration-500
                ${status === 'active' 
                    ? 'border-green-500/50 bg-green-500/10 text-green-500' 
                    : 'border-amber-500/50 bg-amber-500/10 text-amber-500'
                }
            `}
        >
            {/* Indicador visual tipo "LED" */}
            <div className="relative flex h-3 w-3">
                {status === 'active' ? (
                    <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </>
                ) : (
                    <>
                        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </>
                )}
            </div>

            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-tighter leading-none mb-0.5">
                    Estado del Sistema
                </span>
                <span className="text-xs font-bold uppercase tracking-widest leading-none">
                    {status === 'active' ? (
                        'Web Activa'
                    ) : (
                        `Activando... ~${secondsRemaining}s`
                    )}
                </span>
            </div>

            {/* Tooltip o información extra si está activando */}
            {status === 'activating' && (
                <div className="hidden md:block border-l border-amber-500/30 pl-3 ml-1">
                    <p className="text-[10px] leading-tight opacity-80 max-w-[120px]">
                        El backend está arrancando en Render.com
                    </p>
                </div>
            )}
        </div>
    )
}
