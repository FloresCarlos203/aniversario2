import { CARTA } from '../data/config'

export default function LoveLetter() {
  return (
    <div className="carta">
      <div className="carta-sello">💌</div>
      <h3 className="carta-titulo">{CARTA.titulo}</h3>
      {CARTA.parrafos.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      <p className="carta-firma">{CARTA.firma}</p>
    </div>
  )
}
