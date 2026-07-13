import { useState } from "react";
import { fechaBonita, type Cancion } from "../data/config";

interface Props {
  canciones: Cancion[];
  estaDesbloqueada: (c: Cancion) => boolean;
  diaActual: number | null;
  reproduciendo: boolean;
  esHoy: (c: Cancion) => boolean;
  onSeleccionar: (c: Cancion) => void;
}

function PortadaConFallback({
  src,
  dia,
  alt,
}: {
  src: string;
  dia: number;
  alt: string;
}) {
  const [fallo, setFallo] = useState(false);

  if (fallo) {
    return (
      <div className={`portada-fallback fb-${((dia - 1) % 4) + 1}`}>
        <span className="fb-nota">♪</span>
      </div>
    );
  }
  return (
    <img src={src} alt={alt} loading="lazy" onError={() => setFallo(true)} />
  );
}

export default function SongShelf({
  canciones,
  estaDesbloqueada,
  diaActual,
  reproduciendo,
  esHoy,
  onSeleccionar,
}: Props) {
  return (
    <div className="shelf">
      {canciones.map((c) => {
        const abierta = estaDesbloqueada(c);
        const activa = diaActual === c.dia;
        const nueva = abierta && esHoy(c);

        return (
          <button
            key={c.dia}
            type="button"
            className={`shelf-card ${abierta ? "abierta" : "bloqueada"} ${activa ? "activa" : ""}`}
            onClick={() => abierta && onSeleccionar(c)}
            disabled={!abierta}
            aria-label={
              abierta
                ? `Reproducir canción del día ${c.dia}: ${c.titulo}`
                : `Canción del día ${c.dia}, se desbloquea el ${fechaBonita(c.desbloqueo)}`
            }
          >
            <div className="shelf-portada">
              <PortadaConFallback
                src={c.portada}
                dia={c.dia}
                alt={abierta ? c.titulo : "Canción bloqueada"}
              />
              {!abierta && (
                <div className="shelf-candado">
                  <svg
                    viewBox="0 0 24 24"
                    width="26"
                    height="26"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Zm3 4a1.5 1.5 0 0 1 .75 2.8V19a.75.75 0 0 1-1.5 0v-2.2A1.5 1.5 0 0 1 12 14Z" />
                  </svg>
                  <span className="shelf-fecha">
                    {fechaBonita(c.desbloqueo)}
                  </span>
                </div>
              )}
              {activa && reproduciendo && (
                <div className="eq" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              )}
              {nueva && <span className="shelf-nueva">¡Hoy!</span>}
            </div>
            <span className="shelf-dia">Día {c.dia}</span>
            <span className="shelf-titulo">
              {abierta ? c.titulo : "Canción secreta"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
