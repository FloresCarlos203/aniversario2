import { useCallback, useEffect, useState } from 'react'
import { EXTENSION_FOTOS, TOTAL_FOTOS } from '../data/config'

interface Foto {
  n: number
  src: string
}

const FOTOS: Foto[] = Array.from({ length: TOTAL_FOTOS }, (_, i) => ({
  n: i + 1,
  src: `/images/imagen${i + 1}.${EXTENSION_FOTOS}`,
}))

export default function Gallery() {
  const [falladas, setFalladas] = useState<Set<number>>(new Set())
  const [abierta, setAbierta] = useState<number | null>(null) // índice en FOTOS

  const marcarFallo = (n: number) =>
    setFalladas((prev) => {
      const next = new Set(prev)
      next.add(n)
      return next
    })

  const disponibles = FOTOS.filter((f) => !falladas.has(f.n))

  const cerrar = useCallback(() => setAbierta(null), [])

  const mover = useCallback(
    (delta: number) => {
      setAbierta((actual) => {
        if (actual === null || disponibles.length === 0) return actual
        const idx = disponibles.findIndex((f) => f.n === actual)
        const nuevo = (idx + delta + disponibles.length) % disponibles.length
        return disponibles[nuevo].n
      })
    },
    [disponibles],
  )

  useEffect(() => {
    if (abierta === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar()
      if (e.key === 'ArrowLeft') mover(-1)
      if (e.key === 'ArrowRight') mover(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [abierta, cerrar, mover])

  const fotoAbierta = abierta !== null ? FOTOS.find((f) => f.n === abierta) : null

  return (
    <>
      <div className="galeria">
        {FOTOS.map((f, i) => (
          <figure className="polaroid" key={f.n} style={{ ['--rot' as string]: `${((i % 5) - 2) * 2.2}deg` }}>
            {falladas.has(f.n) ? (
              <div className="polaroid-placeholder">
                <span>💜</span>
                <small>imagen{f.n}.{EXTENSION_FOTOS}</small>
              </div>
            ) : (
              <button
                type="button"
                className="polaroid-btn"
                onClick={() => setAbierta(f.n)}
                aria-label={`Ver foto ${f.n} en grande`}
              >
                <img src={f.src} alt={`Nuestro momento ${f.n}`} loading="lazy" onError={() => marcarFallo(f.n)} />
              </button>
            )}
            <figcaption>Momento #{f.n} 💕</figcaption>
          </figure>
        ))}
      </div>

      {fotoAbierta && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={cerrar}>
          <button type="button" className="lb-cerrar" onClick={cerrar} aria-label="Cerrar">
            ✕
          </button>
          <button
            type="button"
            className="lb-nav lb-prev"
            onClick={(e) => { e.stopPropagation(); mover(-1) }}
            aria-label="Foto anterior"
          >
            ‹
          </button>
          <img
            src={fotoAbierta.src}
            alt={`Nuestro momento ${fotoAbierta.n}`}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="lb-nav lb-next"
            onClick={(e) => { e.stopPropagation(); mover(1) }}
            aria-label="Foto siguiente"
          >
            ›
          </button>
        </div>
      )}
    </>
  )
}
