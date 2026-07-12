import { useMemo } from 'react'

const EMOJIS = ['💜', '💚', '🩷', '❤️', '💖', '✨', '🌷', '💕']

/** Pseudoaleatorio determinista (0..1) para que el render sea puro */
function ruido(i: number, sal: number): number {
  const x = Math.sin(i * 127.1 + sal * 311.7) * 43758.5453
  return x - Math.floor(x)
}

interface Heart {
  left: number
  delay: number
  duration: number
  size: number
  emoji: string
}

export default function FloatingHearts({ cantidad = 16 }: { cantidad?: number }) {
  const hearts = useMemo<Heart[]>(
    () =>
      Array.from({ length: cantidad }, (_, i) => ({
        left: ruido(i, 1) * 100,
        delay: ruido(i, 2) * 18,
        duration: 14 + ruido(i, 3) * 14,
        size: 14 + ruido(i, 4) * 20,
        emoji: EMOJIS[i % EMOJIS.length],
      })),
    [cantidad],
  )

  return (
    <div className="hearts-bg" aria-hidden="true">
      {hearts.map((h, i) => (
        <span
          key={i}
          className="heart-float"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            fontSize: `${h.size}px`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  )
}
