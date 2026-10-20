import { useEffect, useState } from 'react'
import Cover from './slides/Cover'
import Situation from './slides/Situation'
import Owners from './slides/Owners'
import Ranking from './slides/Ranking'
import Flow from './slides/Flow'
import Critical from './slides/Critical'
import Process from './slides/Process'
import Risks from './slides/Risks'

const SLIDES = [
  { id: 'capa', label: 'Capa', C: Cover },
  { id: 'situacao', label: 'Situação', C: Situation },
  { id: 'divisao', label: 'Divisão', C: Owners },
  { id: 'ranking', label: 'Dificuldade', C: Ranking },
  { id: 'fluxo', label: 'Fluxo', C: Flow },
  { id: 'critico', label: 'Caminho crítico', C: Critical },
  { id: 'processo', label: 'Como avança', C: Process },
  { id: 'riscos', label: 'Riscos', C: Risks },
]

export default function App() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const els = SLIDES.map((s) => document.getElementById(s.id)!)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLElement))
        })
      },
      { threshold: 0.6 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const go = (i: number) =>
      document.getElementById(SLIDES[Math.max(0, Math.min(SLIDES.length - 1, i))].id)?.scrollIntoView()
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key)) {
        e.preventDefault()
        go(active + 1)
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        go(active - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <>
      <main>
        {SLIDES.map(({ id, C }) => (
          <section
            key={id}
            id={id}
            className="flex min-h-svh snap-start items-center justify-center px-6 py-16 md:px-16"
          >
            <C />
          </section>
        ))}
      </main>
      <nav aria-label="Slides" className="fixed right-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {SLIDES.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={s.label}
            aria-current={i === active ? 'true' : undefined}
            title={s.label}
            className={`block h-2.5 w-2.5 rounded-full transition ${i === active ? 'scale-125 bg-accent' : 'bg-line hover:bg-mute'}`}
          />
        ))}
      </nav>
    </>
  )
}
