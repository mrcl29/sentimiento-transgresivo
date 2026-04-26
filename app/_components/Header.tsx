/**
 * Header estático del sitio.
 * Acepta un slot `actions` para inyectar elementos interactivos desde el cliente.
 */
export default function Header({ actions }: { actions?: React.ReactNode }) {
  return (
    <header className="mb-10 border-b-2 border-stone-200 pb-6 flex justify-between items-start gap-4">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-red-600">
          Sentimiento Transgresivo
        </h1>
        <p className="text-stone-200 mt-2 text-lg">
          Análisis de métricas y letras de Extremoduro y Robe.
        </p>
      </div>
      {actions}
    </header>
  )
}
