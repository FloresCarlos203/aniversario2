import { fechaAniversario } from '../data/config'

interface Props {
  now: Date
}

function Unidad({ valor, etiqueta }: { valor: number; etiqueta: string }) {
  return (
    <div className="cd-unidad">
      <span className="cd-num">{String(valor).padStart(2, '0')}</span>
      <span className="cd-label">{etiqueta}</span>
    </div>
  )
}

export default function Countdown({ now }: Props) {
  const diff = fechaAniversario().getTime() - now.getTime()

  if (diff <= 0) {
    return (
      <div className="countdown celebracion">
        <span>🎉 ¡Feliz aniversario, mi amor! 💜</span>
      </div>
    )
  }

  const seg = Math.floor(diff / 1000)
  const dias = Math.floor(seg / 86400)
  const horas = Math.floor((seg % 86400) / 3600)
  const min = Math.floor((seg % 3600) / 60)
  const s = seg % 60

  return (
    <div className="countdown" title="Tiempo para nuestro aniversario">
      <span className="cd-corazon">💜</span>
      <Unidad valor={dias} etiqueta="días" />
      <span className="cd-sep">:</span>
      <Unidad valor={horas} etiqueta="horas" />
      <span className="cd-sep">:</span>
      <Unidad valor={min} etiqueta="min" />
      <span className="cd-sep">:</span>
      <Unidad valor={s} etiqueta="seg" />
    </div>
  )
}
