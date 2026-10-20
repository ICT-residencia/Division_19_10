import { useCallback, useEffect, useRef, useState } from 'react'
import FX, { type Scene } from './components/FX'
import Drawer from './components/Drawer'
import { PanelBody, panelLabel, type Panel } from './components/panels'
import { SNAPSHOT } from './data'
import Open from './sections/Open'
import Where from './sections/Where'
import Built from './sections/Built'
import Split from './sections/Split'
import Timeline from './sections/Timeline'
import Execution from './sections/Execution'
import Next from './sections/Next'
import type { SectionProps } from './sections/types'

interface Def {
  id: string
  label: string
  scene: Scene
  cls?: string
  C: (p: SectionProps) => React.ReactElement
}

const SECTIONS: Def[] = [
  { id: 'abertura', label: 'Abertura', scene: 'network', cls: 'hero', C: Open as Def['C'] },
  { id: 'onde-estamos', label: 'Onde estamos', scene: 'ambient', C: Where },
  { id: 'construimos', label: 'O que já construímos', scene: 'chains', C: Built },
  { id: 'divisao', label: 'A divisão', scene: 'ambient', cls: 'block--dense', C: Split },
  { id: 'fluxo', label: 'O fluxo', scene: 'flow', cls: 'block--dense', C: Timeline },
  { id: 'execucao', label: 'Execução por responsável', scene: 'ambient', cls: 'block--dense', C: Execution },
  { id: 'proximos', label: 'Próximos passos', scene: 'closing', cls: 'block--closing', C: Next },
]

export default function App() {
  const [active, setActive] = useState(0)
  const [seen, setSeen] = useState<Set<number>>(new Set([0]))
  const [panel, setPanel] = useState<Panel | null>(null)
  const [full, setFull] = useState(false)
  const panelRef = useRef<Panel | null>(null)
  panelRef.current = panel

  const open = useCallback((p: Panel) => setPanel(p), [])
  const close = useCallback(() => setPanel(null), [])

  const go = useCallback((i: number) => {
    const k = Math.max(0, Math.min(SECTIONS.length - 1, i))
    document.getElementById(SECTIONS[k].id)?.scrollIntoView()
  }, [])

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)!)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const i = els.indexOf(e.target as HTMLElement)
          setActive(i)
          setSeen((s) => (s.has(i) ? s : new Set(s).add(i)))
        })
      },
      { threshold: 0.5 },
    )
    els.forEach((el) => io.observe(el))
    const hash = window.location.hash.slice(1)
    const start = SECTIONS.findIndex((s) => s.id === hash)
    if (start > 0) requestAnimationFrame(() => go(start))
    return () => io.disconnect()
  }, [go])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (panelRef.current) return
      const t = e.target as HTMLElement
      if (t && ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return
      const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, PageDown: 1, ArrowUp: -1, ArrowLeft: -1, PageUp: -1 }
      if (e.key in keys) {
        e.preventDefault()
        go(active + keys[e.key])
      } else if (e.key === 'Home') {
        e.preventDefault()
        go(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        go(SECTIONS.length - 1)
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFull()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, go])

  useEffect(() => {
    const onFs = () => setFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    history.replaceState(null, '', `#${SECTIONS[active].id}`)
  }, [active])

  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    else document.documentElement.requestFullscreen?.().catch(() => undefined)
  }

  return (
    <>
      <FX scene={SECTIONS[active].scene} />
      <div className="vignette" aria-hidden="true" />
      <main className="deck">
        {SECTIONS.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            aria-label={s.label}
            className={`block ${s.cls ?? ''} ${seen.has(i) ? 'is-visible' : ''}`}
          >
            <s.C visible={active === i} open={open} n={i + 1} />
          </section>
        ))}
      </main>

      <nav className="dotnav" aria-label="Navegação da apresentação">
        {SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => go(i)} aria-label={`${i + 1}. ${s.label}`} aria-current={i === active ? 'true' : undefined}>
            <em>{String(i + 1).padStart(2, '0')} · {s.label}</em>
            <span />
          </button>
        ))}
      </nav>

      <div className="chrome">
        <span className="snap">Snapshot {SNAPSHOT}</span>
        <i className="sep snap" />
        <button onClick={() => open({ kind: 'sources' })}>Fontes</button>
        <i className="sep" />
        <button onClick={toggleFull} aria-pressed={full}>{full ? 'Sair da tela cheia' : 'Tela cheia'}</button>
      </div>

      <Drawer open={!!panel} onClose={close} label={panel ? panelLabel(panel) : ''}>
        {panel && <PanelBody panel={panel} open={open} />}
      </Drawer>
    </>
  )
}
