import { useEffect, useRef, useState } from 'react'
import { fechaBonita, type Cancion } from '../data/config'

interface Props {
  cancion: Cancion | null
  /** Cambia cada vez que se pide reproducir desde afuera (clic en una tarjeta) */
  playToken: number
  puedeAnterior: boolean
  puedeSiguiente: boolean
  onAnterior: () => void
  onSiguiente: () => void
  onPlayingChange: (playing: boolean) => void
}

function formatoTiempo(seg: number): string {
  if (!Number.isFinite(seg) || seg < 0) return '0:00'
  const m = Math.floor(seg / 60)
  const s = Math.floor(seg % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function VinylPlayer({
  cancion,
  playToken,
  puedeAnterior,
  puedeSiguiente,
  onAnterior,
  onSiguiente,
  onPlayingChange,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const lastSrcRef = useRef<string | null>(null)

  const [playing, setPlaying] = useState(false)
  const [tiempo, setTiempo] = useState(0)
  const [duracion, setDuracion] = useState(0)
  const [error, setError] = useState(false)
  const [falloPortada, setFalloPortada] = useState(false)

  // Carga la canción cuando cambia; reproduce/pausa cuando llega un playToken
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !cancion) return

    if (lastSrcRef.current !== cancion.audio) {
      lastSrcRef.current = cancion.audio
      setError(false)
      setFalloPortada(false)
      setTiempo(0)
      setDuracion(0)
      audio.src = cancion.audio
      audio.load()
      if (playToken > 0) audio.play().catch(() => {})
    } else if (playToken > 0) {
      if (audio.paused) audio.play().catch(() => {})
      else audio.pause()
    }
  }, [playToken, cancion])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !cancion || error) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }

  const seek = (valor: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = valor
    setTiempo(valor)
  }

  const handlePlay = () => { setPlaying(true); onPlayingChange(true) }
  const handlePause = () => { setPlaying(false); onPlayingChange(false) }
  const handleEnded = () => {
    setPlaying(false)
    onPlayingChange(false)
    if (puedeSiguiente) onSiguiente()
  }

  if (!cancion) {
    return (
      <div className="player player-vacio">
        <div className="vinyl-wrap">
          <div className="vinyl">
            <div className="vinyl-label">
              <div className="portada-fallback fb-1">
                <span className="fb-nota">♪</span>
              </div>
            </div>
            <div className="vinyl-hole" />
          </div>
        </div>
        <div className="player-info">
          <h3>Muy pronto... 💜</h3>
          <p className="player-dedicatoria">
            La primera canción se desbloquea muy pronto. ¡Vuelve mañana para escuchar tu primera sorpresa!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="player">
      <audio
        ref={audioRef}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onTimeUpdate={(e) => setTiempo(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuracion(e.currentTarget.duration)}
        onError={() => setError(true)}
        preload="metadata"
      />

      <div className="vinyl-wrap">
        <div className={`vinyl ${playing ? 'girando' : ''}`}>
          <div className="vinyl-brillo" />
          <div className="vinyl-label">
            {falloPortada ? (
              <div className={`portada-fallback fb-${((cancion.dia - 1) % 4) + 1}`}>
                <span className="fb-nota">♪</span>
              </div>
            ) : (
              <img
                src={cancion.portada}
                alt={`Portada de ${cancion.titulo}`}
                onError={() => setFalloPortada(true)}
              />
            )}
          </div>
          <div className="vinyl-hole" />
        </div>
      </div>

      <div className="player-info">
        <span className="player-dia">
          Día {cancion.dia} · {fechaBonita(cancion.desbloqueo)}
        </span>
        <h3 className="player-titulo">{cancion.titulo}</h3>
        <p className="player-artista">{cancion.artista}</p>
        <p className="player-dedicatoria">“{cancion.dedicatoria}”</p>

        {error && (
          <p className="player-error">
            Aún no se ha subido este audio 🎧 (sube <code>{cancion.audio}</code>)
          </p>
        )}

        <div className="player-progreso">
          <span className="player-tiempo">{formatoTiempo(tiempo)}</span>
          <input
            type="range"
            min={0}
            max={duracion || 1}
            step={0.1}
            value={Math.min(tiempo, duracion || 1)}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Progreso de la canción"
            style={{
              backgroundSize: `${duracion ? (tiempo / duracion) * 100 : 0}% 100%`,
            }}
          />
          <span className="player-tiempo">{formatoTiempo(duracion)}</span>
        </div>

        <div className="player-controles">
          <button
            type="button"
            className="ctrl"
            onClick={onAnterior}
            disabled={!puedeAnterior}
            aria-label="Canción anterior"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M6 5a1 1 0 0 1 2 0v6.3l9.4-6.1A1 1 0 0 1 19 6v12a1 1 0 0 1-1.6.8L8 12.7V19a1 1 0 1 1-2 0V5Z" />
            </svg>
          </button>

          <button
            type="button"
            className="ctrl ctrl-play"
            onClick={togglePlay}
            aria-label={playing ? 'Pausar' : 'Reproducir'}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
                <path d="M7 4.5A1.5 1.5 0 0 1 8.5 6v12a1.5 1.5 0 0 1-3 0V6A1.5 1.5 0 0 1 7 4.5Zm10 0A1.5 1.5 0 0 1 18.5 6v12a1.5 1.5 0 0 1-3 0V6A1.5 1.5 0 0 1 17 4.5Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
                <path d="M8.5 5.1a1 1 0 0 1 1.5-.87l10 6.03a1 1 0 0 1 0 1.7l-10 6.04a1 1 0 0 1-1.5-.86V5.1Z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="ctrl"
            onClick={onSiguiente}
            disabled={!puedeSiguiente}
            aria-label="Canción siguiente"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M18 5a1 1 0 0 0-2 0v6.3L6.6 5.2A1 1 0 0 0 5 6v12a1 1 0 0 0 1.6.8l9.4-6.1V19a1 1 0 1 0 2 0V5Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
