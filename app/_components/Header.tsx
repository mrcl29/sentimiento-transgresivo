/**
 * Header estático del sitio.
 * Server Component — no necesita interactividad.
 */
export default function Header() {
  return (
    <header className="mb-10 border-b-2 border-stone-200 pb-6">
      <h1 className="text-4xl font-bold tracking-tight text-red-600">
        Sentimiento Transgresivo
      </h1>
      <p className="text-stone-200 mt-2 text-lg">
        Análisis de métricas y letras de Extremoduro y Robe.
      </p>
    </header>
  )
}
