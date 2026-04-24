import data from '@/data/dataset.json';

export default function Home() {
  return (
    <main className="p-8 font-sans bg-zinc-950 text-zinc-100 min-h-screen">
      <header className="mb-10 border-b border-zinc-800 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-500">
          Sentimiento Transgresivo
        </h1>
        <p className="text-zinc-400 mt-2">
          Análisis de métricas y letras de Extremoduro y Robe.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((track) => (
          <article
            key={track.id}
            className="border border-zinc-800 p-6 rounded-xl bg-zinc-900 hover:border-emerald-500/50 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-1">{track.cancion}</h2>
            <p className="text-zinc-400 text-sm mb-4">
              {track.artista} — <span className="italic">{track.album}</span>
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="bg-red-950/50 text-red-400 border border-red-900/50 px-3 py-1 rounded-full text-xs font-medium">
                Negatividad: {(track.sentimiento.neg * 100).toFixed(0)}%
              </span>
              <span className="bg-yellow-950/50 text-yellow-400 border border-yellow-900/50 px-3 py-1 rounded-full text-xs font-medium">
                Energía: {(track.spotify.energy * 100).toFixed(0)}%
              </span>
              <span className="bg-blue-950/50 text-blue-400 border border-blue-900/50 px-3 py-1 rounded-full text-xs font-medium">
                Valencia: {(track.spotify.valence * 100).toFixed(0)}%
              </span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
