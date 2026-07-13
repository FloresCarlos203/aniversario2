// ============================================================
//  💜 CONFIGURACIÓN DEL SITIO — edita todo desde aquí
// ============================================================

// Nombres de la pareja
export const PAREJA = {
  el: "Carlos",
  ella: "Lisha", // 👈 pon aquí el nombre de ella
};

// Fecha del aniversario (año, mes, día) — 19 de julio de 2026
export const ANIVERSARIO = { anio: 2026, mes: 7, dia: 19 };

// Años que cumplen
export const ANIOS_JUNTOS = 2;

// Cantidad de fotos en public/images (imagen1.jpg ... imagen20.jpg)
export const TOTAL_FOTOS = 55;

// Extensión de las fotos. Si tus fotos son .png o .jpeg, cámbialo aquí.
export const EXTENSION_FOTOS = "jpg";

// Carta final para ella
export const CARTA = {
  titulo: "Para ti, mi amor",
  parrafos: [
    "Hace dos años comenzó la historia más bonita de mi vida. Cada día a tu lado es mi lugar favorito en el mundo.",
    "Quise regalarte algo hecho con lo que más me apasiona, para dedicarte una canción por cada día de esta semana, porque las palabras a veces no alcanzan y la música dice lo que yo siento por ti.",
    //"Gracias por estos dos años de risas, aventuras y amor. Esto es solo el comienzo de todo lo que nos falta por vivir juntos.",
  ],
  firma: "Con todo mi amor, Carlos 💖",
};

// ============================================================
//  🎵 LAS 7 CANCIONES
//  - Sube los audios a:    public/music/dia1.mp3 ... dia7.mp3
//  - Sube las portadas a:  public/covers/portada1.jpg ... portada7.jpg
//  - "desbloqueo" es la fecha (AAAA-MM-DD) en que se abre cada canción
//  - Edita título, artista y dedicatoria de cada día 👇
// ============================================================

export interface Cancion {
  dia: number;
  desbloqueo: string;
  titulo: string;
  artista: string;
  dedicatoria: string;
  audio: string;
  portada: string;
}

export const CANCIONES: Cancion[] = [
  {
    dia: 1,
    desbloqueo: "2026-07-13",
    titulo: "Al aire",
    artista: "Morat",
    dedicatoria:
      "Esta canción me recuerda al día en que te conocí. Desde entonces, todo cambió en mi vida",
    audio: "/music/dia7.mp3",
    portada: "/covers/portada1.jpg",
  },
  {
    dia: 2,
    desbloqueo: "2026-07-14",
    titulo: "Just the Way You Are",
    artista: "Bruno Mars",
    dedicatoria:
      "Cada vez que la escucho pienso en tu sonrisa, la que ilumina hasta mis días más grises",
    audio: "/music/dia15.mp3",
    portada: "/covers/portada2.jpg",
  },
  {
    dia: 3,
    desbloqueo: "2026-07-15",
    titulo: "Mi persona favorita",
    artista: "Río roma",
    dedicatoria:
      "Esta es de esas canciones que expresan que eres mi lugar seguro",
    audio: "/music/dia17.mp3",
    portada: "/covers/portada3.jpg",
  },
  {
    dia: 4,
    desbloqueo: "2026-07-16",
    titulo: "Thinking Out Loud",
    artista: "Ed Sheeran",
    dedicatoria:
      "Para bailarla juntos, aunque sea en la sala de la casa, descalzos y abrazados",
    audio: "/music/dia29.mp3",
    portada: "/covers/portada4.jpg",
  },
  {
    dia: 5,
    desbloqueo: "2026-07-17",
    titulo: "Daylight",
    artista: "Taylor Swift",
    dedicatoria:
      "Me haces sentir en casa. Esta canción es ese abrazo tuyo que me diste por primera vez",
    audio: "/music/dia13.mp3",
    portada: "/covers/portada5.jpg",
  },
  {
    dia: 6,
    desbloqueo: "2026-07-18",
    titulo: "Te amo y más",
    artista: "Manolo",
    dedicatoria:
      "Un día antes de nuestro aniversario, gracias por elegirme cada día, como yo te elijo a ti",
    audio: "/music/dia4.mp3",
    portada: "/covers/portada6.jpg",
  },
  {
    dia: 7,
    desbloqueo: "2026-07-19",
    titulo: "Por amarte así",
    artista: "Cristian Castro",
    dedicatoria:
      "¡Feliz aniversario, mi amor! Dos años contigo y quiero mil más. Esta canción te la dedico con mucho amor",
    audio: "/music/dia26.mp3",
    portada: "/covers/portada7.jpg",
  },
];

// ============================================================
//  Utilidades de fecha (no necesitas tocar esto)
// ============================================================

/** Convierte 'AAAA-MM-DD' a medianoche LOCAL de ese día */
export function fechaLocal(iso: string): Date {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d, 0, 0, 0);
}

export function fechaAniversario(): Date {
  return new Date(
    ANIVERSARIO.anio,
    ANIVERSARIO.mes - 1,
    ANIVERSARIO.dia,
    0,
    0,
    0,
  );
}

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/** Formatea '2026-07-13' como '13 de julio' */
export function fechaBonita(iso: string): string {
  const f = fechaLocal(iso);
  return `${f.getDate()} de ${MESES[f.getMonth()]}`;
}
