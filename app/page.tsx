"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import data from '@/data/dataset.json';
import { Track } from '@/app/types/track';

interface Album {
  name: string;
  artist: string;
  year: number;
  tracks: Track[];
}

const getAlbumCoverUrl = (albumName: string) => {
  const slug = albumName
    .toLowerCase()
    .normalize('NFD') // Separa los acentos de las letras
    .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
    .replace(/,/g, '') // Elimina las comas
    .replace(/[^a-z0-9]+/g, '_') // Reemplaza espacios y caracteres raros por guiones bajos
    .replace(/^_+|_+$/g, ''); // Limpia guiones bajos a los bordes
    console.log(slug)
  return `/assets/${slug}.png`;
};

export default function Home() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoverColor, setHoverColor] = useState<string>('#380a0a'); // Rojo oscuro por defecto
  const colorCache = useRef<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<keyof Track | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  // Agrupamos las canciones por álbumes, ordenamos por año y separamos por artista
  const { extremoduroAlbums, robeAlbums } = useMemo(() => {
    const map = new Map<string, Album>();
    (data as Track[]).forEach((track) => {
      if (!map.has(track.album_name)) {
        map.set(track.album_name, {
          name: track.album_name,
          artist: track.artista_busqueda,
          year: track.year,
          tracks: [],
        });
      }
      map.get(track.album_name)!.tracks.push(track);
    });
    const allAlbums = Array.from(map.values()).sort((a, b) => a.year - b.year);
    return {
      extremoduroAlbums: allAlbums.filter(a => a.artist === 'Extremoduro'),
      robeAlbums: allAlbums.filter(a => a.artist === 'Robe'),
    };
  }, []);

  const openAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setSortKey(null);
    setSortDirection(null);
    // Retraso mínimo para permitir que el DOM se monte antes de aplicar las clases de transición
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAlbum = () => {
    setIsAnimating(false);
    // Espera a que termine la animación antes de desmontar el componente
    setTimeout(() => setSelectedAlbum(null), 300);
  };

  useEffect(() => {
    if (selectedAlbum) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAlbum();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAlbum]);

  // Extrae y calcula el color predominante de la carátula
  const handleMouseEnter = (album: Album) => {
    if (colorCache.current[album.name]) {
      setHoverColor(colorCache.current[album.name]);
      return;
    }

    const url = getAlbumCoverUrl(album.name);
    const img = document.createElement('img');
    img.src = url;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          // Multiplicamos por 0.4 para oscurecer el color y mantener la atmósfera oscura
          const color = `rgb(${Math.floor(r * 0.4)}, ${Math.floor(g * 0.4)}, ${Math.floor(b * 0.4)})`;
          colorCache.current[album.name] = color;
          setHoverColor(color);
        }
      } catch (e) {
        console.error('Error extrayendo color', e);
      }
    };
  };

  const handleSort = (key: keyof Track) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedTracks = useMemo(() => {
    if (!selectedAlbum) return [];
    const tracks = [...selectedAlbum.tracks];
    if (sortKey && sortDirection) {
      tracks.sort((a, b) => {
        const aVal = a[sortKey] as string | number;
        const bVal = b[sortKey] as string | number;
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      tracks.sort((a, b) => a.track_number - b.track_number);
    }
    return tracks;
  }, [selectedAlbum, sortKey, sortDirection]);

  const renderSortableHeader = (label: string, key: keyof Track, className: string, justifyClass = 'justify-start') => {
    const isActive = sortKey === key;
    return (
      <th
        key={key}
        className={`p-4 font-bold cursor-pointer hover:text-stone-100 transition-colors select-none group ${className}`}
        onClick={() => handleSort(key)}
        title={`Ordenar por ${label}`}
      >
        <div className={`w-full flex items-center gap-2 ${justifyClass}`}>
          {label}
          <span
            className={`w-4 inline-block text-center text-lg font-black transition-opacity ${
              isActive ? 'text-red-500 opacity-100' : 'text-stone-500 opacity-0 group-hover:opacity-50'
            }`}
          >
            {isActive ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
          </span>
        </div>
      </th>
    );
  };

  return (
    <main className="p-8 font-sans text-stone-100 min-h-screen relative">
      {/* Fondo dinámico y animado */}
      <div className="fixed inset-0 -z-10 transition-colors duration-1000 ease-out pointer-events-none" style={{ backgroundColor: hoverColor }}>
        <div className="absolute inset-0 bg-linear-to-br from-transparent to-stone-950" />
      </div>

      <header className="mb-10 border-b-2 border-stone-200 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-red-600">
          Sentimiento Transgresivo
        </h1>
        <p className="text-stone-200 mt-2 text-lg">
          Análisis de métricas y letras de Extremoduro y Robe.
        </p>
      </header>

      {/* Secciones por Artista */}
      {[
        { title: 'Extremoduro', albums: extremoduroAlbums },
        { title: 'Robe', albums: robeAlbums },
      ].map((section) => (
        <section key={section.title} className="mb-12 last:mb-0">
          <h2 className="text-3xl font-bold mb-6 text-stone-100 border-l-4 border-red-800 pl-4 uppercase tracking-tighter">
            {section.title}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {section.albums.map((album) => (
              <button
                key={album.name}
                onClick={() => openAlbum(album)}
                onMouseEnter={() => handleMouseEnter(album)}
                onMouseLeave={() => setHoverColor('#380a0a')}
            className="group flex flex-col text-left hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
              >
            <div className="relative w-full aspect-square border border-stone-800 bg-stone-900 overflow-hidden rounded-sm group-hover:scale-105 group-hover:shadow-[0_10px_40px_-10px_rgba(185,28,28,0.5)] transition-all duration-300 mb-3">
              <Image
                src={getAlbumCoverUrl(album.name)}
                alt={`Carátula de ${album.name}`}
                fill
                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="transition-transform duration-300 origin-left group-hover:scale-105 mt-4">
              <h2 className="text-xl font-bold leading-tight group-hover:text-red-600 transition-colors">
                {album.name}
              </h2>
              <p className="text-stone-400 mt-1 font-serif italic text-lg">{album.year}</p>
            </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      {/* Modal a pantalla completa para los detalles del álbum */}
      {selectedAlbum && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-sm p-4 sm:p-8 transition-opacity duration-300 ${
            isAnimating ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeAlbum}
        >
          <div
            className={`bg-stone-950 border border-red-800 w-[95vw] max-w-350 h-full max-h-[90vh] overflow-hidden flex flex-col transition-all duration-500 ease-out transform shadow-2xl shadow-red-900/20 rounded-sm ${
              isAnimating ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-stone-950/95 backdrop-blur border-b border-red-800 p-6 flex justify-between items-start shrink-0 z-20">
              <div>
                <h2 className="text-4xl sm:text-5xl font-black text-stone-50 uppercase tracking-tighter">
                  {selectedAlbum.name}
                </h2>
                <p className="text-xl text-red-600 font-serif italic mt-2">
                  {selectedAlbum.artist} — {selectedAlbum.year}
                </p>
              </div>
              <button
                onClick={closeAlbum}
                className="bg-red-800 text-stone-50 font-bold px-4 py-2 uppercase hover:bg-red-600 hover:scale-105 active:scale-95 transition-all rounded-sm"
              >
                Cerrar (ESC)
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-auto bg-stone-950">
              <table className="w-full text-left border-collapse min-w-300">
                <thead className="sticky top-0 bg-stone-900 border-b border-stone-800 text-stone-300 text-sm uppercase font-sans z-10 shadow-md">
                  <tr>
                    {renderSortableHeader('#', 'track_number', 'w-16', 'justify-center')}
                    <th className="p-4 font-medium min-w-62.5">Título</th>
                    {renderSortableHeader('Duración', 'duration_ms', 'w-24', 'justify-center')}
                    {renderSortableHeader('Bailable', 'danceability', 'w-28')}
                    {renderSortableHeader('Energía', 'energy', 'w-28')}
                    {renderSortableHeader('Valencia', 'valence', 'w-28')}
                    {renderSortableHeader('Acústica', 'acousticness', 'w-28')}
                    {renderSortableHeader('Instrum.', 'instrumentalness', 'w-28')}
                    {renderSortableHeader('Directo', 'liveness', 'w-28')}
                    {renderSortableHeader('Hablado', 'speechiness', 'w-28')}
                    {renderSortableHeader('Tempo', 'tempo', 'w-28', 'justify-end')}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/50">
                  {sortedTracks.map((track) => (
                      <tr key={track.track_id} className="hover:bg-stone-900/30 transition-colors group">
                        <td className="p-4 text-red-700 font-sans font-bold text-2xl text-center">
                          {track.track_number}
                        </td>
                        <td className="p-4">
                          <h3 className="text-lg font-bold text-stone-100 group-hover:text-red-500 transition-colors">{track.track_name}</h3>
                        </td>
                        <td className="p-4 text-stone-400 font-sans text-base text-center">
                          {Math.floor(track.duration_ms / 60000)}:
                          {Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, '0')}
                        </td>
                        {[
                          track.danceability,
                          track.energy,
                          track.valence,
                          track.acousticness,
                          track.instrumentalness,
                          track.liveness,
                          track.speechiness,
                        ].map((val, idx) => (
                          <td key={idx} className="p-4 align-middle">
                            <div className="flex flex-col gap-2">
                              <span className="text-stone-200 text-sm font-bold tracking-tighter">
                                {(val * 100).toFixed(0)}%
                              </span>
                              <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden border border-stone-700">
                                <div
                                  className="bg-red-700 h-full rounded-full transition-all duration-500 ease-out group-hover:bg-red-500"
                                  style={{ width: `${Math.min(Math.max(val * 100, 0), 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        ))}
                        <td className="p-4 text-stone-300 font-sans text-base font-medium text-right whitespace-nowrap">
                          {Math.round(track.tempo)} <span className="text-sm text-stone-500">BPM</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
