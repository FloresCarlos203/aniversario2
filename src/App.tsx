import { useMemo, useState } from 'react'
import './App.css'
import Countdown from './components/Countdown'
import FloatingHearts from './components/FloatingHearts'
import Gallery from './components/Gallery'
import LoveLetter from './components/LoveLetter'
import SongShelf from './components/SongShelf'
import VinylPlayer from './components/VinylPlayer'
import {
  ANIOS_JUNTOS,
  ANIVERSARIO,
  CANCIONES,
  PAREJA,
  fechaAniversario,
  fechaLocal,
  type Cancion,
} from './data/config'
import { useNow } from './hooks/useNow'

// Con ?demo en la URL se desbloquea todo (para que pruebes el sitio):
// http://localhost:5173/?demo
const MODO_DEMO = new URLSearchParams(window.location.search).has('demo')

function estaDesbloqueada(c: Cancion, now: Date): boolean {
  return MODO_DEMO || now.getTime() >= fechaLocal(c.desbloqueo).getTime()
}

function esMismoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function App() {
  const now = useNow(1000)

  const desbloqueadas = useMemo(
    () => CANCIONES.filter((c) => estaDesbloqueada(c, now)),
    [now],
  )

  const [seleccion, setSeleccion] = useState<{ dia: number | null; token: number }>(() => {
    const inicio = new Date()
    const abiertas = CANCIONES.filter((c) => estaDesbloqueada(c, inicio))
    return { dia: abiertas.length ? abiertas[abiertas.length - 1].dia : null, token: 0 }
  })

  const [reproduciendo, setReproduciendo] = useState(false)

  // Si aún no hay selección (p. ej. se desbloquea la primera a medianoche),
  // se usa la primera canción desbloqueada sin necesidad de un efecto.
  const diaEfectivo = seleccion.dia ?? desbloqueadas[0]?.dia ?? null
  const cancionActual = CANCIONES.find((c) => c.dia === diaEfectivo) ?? null
  const idxActual = cancionActual
    ? desbloqueadas.findIndex((c) => c.dia === cancionActual.dia)
    : -1

  const seleccionar = (c: Cancion) =>
    setSeleccion((s) => ({ dia: c.dia, token: s.token + 1 }))

  const anterior = () => {
    if (idxActual > 0) seleccionar(desbloqueadas[idxActual - 1])
  }
  const siguiente = () => {
    if (idxActual >= 0 && idxActual < desbloqueadas.length - 1)
      seleccionar(desbloqueadas[idxActual + 1])
  }

  const esAniversario = now.getTime() >= fechaAniversario().getTime()

  return (
    <div className="app">
      <FloatingHearts />
      <Countdown now={now} />

      <header className="hero-amor">
        <p className="hero-script">Nuestra historia en 7 canciones</p>
        <h1 className="hero-titulo">
          {ANIOS_JUNTOS} Años Juntos
        </h1>
        <p className="hero-nombres">
          {PAREJA.el} <span className="hero-corazon">❤</span> {PAREJA.ella}
        </p>
        <p className="hero-fecha">
          {ANIVERSARIO.dia} · julio · {ANIVERSARIO.anio}
        </p>
        {esAniversario && (
          <p className="hero-banner">🎉 ¡Hoy es nuestro aniversario! Te amo 💜 🎉</p>
        )}
      </header>

      <main>
        <section className="seccion">
          <h2 className="seccion-titulo">
            <span className="seccion-emoji">🎵</span> Una canción por día
          </h2>
          <p className="seccion-sub">
            Cada día de esta semana se desbloquea una canción dedicada para ti.
            ¡La última se abre el día de nuestro aniversario!
          </p>

          <SongShelf
            canciones={CANCIONES}
            estaDesbloqueada={(c) => estaDesbloqueada(c, now)}
            diaActual={diaEfectivo}
            reproduciendo={reproduciendo}
            esHoy={(c) => esMismoDia(fechaLocal(c.desbloqueo), now)}
            onSeleccionar={seleccionar}
          />

          <VinylPlayer
            cancion={cancionActual}
            playToken={seleccion.token}
            puedeAnterior={idxActual > 0}
            puedeSiguiente={idxActual >= 0 && idxActual < desbloqueadas.length - 1}
            onAnterior={anterior}
            onSiguiente={siguiente}
            onPlayingChange={setReproduciendo}
          />
        </section>

        <section className="seccion">
          <h2 className="seccion-titulo">
            <span className="seccion-emoji">📸</span> Nuestros momentos
          </h2>
          <p className="seccion-sub">
            Veinte recuerdos de estos dos años que guardo en el corazón.
          </p>
          <Gallery />
        </section>

        <section className="seccion">
          <h2 className="seccion-titulo">
            <span className="seccion-emoji">💌</span> Para ti
          </h2>
          <LoveLetter />
        </section>
      </main>

      <footer className="pie">
        Hecho con 💜, React y mucho amor por {PAREJA.el} · {ANIVERSARIO.anio}
      </footer>
    </div>
  )
}

export default App
