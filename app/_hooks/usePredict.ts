import { useState, useCallback } from 'react'

export function usePredict() {
    const [isPredictOpen, setIsPredictOpen] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [text, setText] = useState('')
    const [result, setResult] = useState<{ is_match: boolean, probability: number } | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const openPredict = useCallback(() => {
        setIsPredictOpen(true)
        setTimeout(() => setIsAnimating(true), 10)
    }, [])

    const closePredict = useCallback(() => {
        setIsAnimating(false)
        setTimeout(() => {
            setIsPredictOpen(false)
            setResult(null)
            setText('')
            setError(null)
        }, 300)
    }, [])

    const runPrediction = useCallback(async (inputText: string) => {
        if (!inputText.trim()) return
        
        setIsLoading(true)
        setError(null)
        setResult(null)
        
        try {
            const res = await fetch(`/api/predict?text=${encodeURIComponent(inputText)}`)
            if (!res.ok) throw new Error('Error en la predicción')
            const data = await res.json()
            setResult(data)
        } catch (e) {
            console.error('Error runPrediction:', e)
            setError('Hubo un problema al conectar con el cerebro de Robe.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        isPredictOpen,
        isAnimating,
        text,
        setText,
        result,
        isLoading,
        error,
        openPredict,
        closePredict,
        runPrediction
    }
}
