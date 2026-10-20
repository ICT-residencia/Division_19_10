import { Fragment, type ReactNode } from 'react'
import { stateOf, type State, type Task } from '../data'
import type { Progress } from '../store'

/** Renderiza `código` e **negrito** do texto das issues. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('`') ? (
          <code key={i} className="inline-code">{p.slice(1, -1)}</code>
        ) : p.startsWith('**') ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}

/** Três categorias, como pedido: Concluída, Em progresso (com Em revisão) e Pendente (com Bloqueada). */
export const STATUS: Record<State, { main: 'Concluída' | 'Em progresso' | 'Pendente'; sub?: string; cls: string }> = {
  done: { main: 'Concluída', cls: 'done' },
  review: { main: 'Em progresso', sub: 'Em revisão', cls: 'review' },
  progress: { main: 'Em progresso', cls: 'progress' },
  ready: { main: 'Pendente', cls: 'ready' },
  blocked: { main: 'Pendente', sub: 'Bloqueada', cls: 'blocked' },
}

export function StatusPill({ task, compact }: { task: Task; compact?: boolean }) {
  const s = STATUS[stateOf(task)]
  return (
    <span className="status">
      <span className={`tag tag--${s.cls}`}>{s.main}</span>
      {s.sub && <span className={`sub sub--${s.cls}`}>{compact ? s.sub : `· ${s.sub}`}</span>}
    </span>
  )
}

export function Bar({ p, tone = 'accent' }: { p: Progress; tone?: 'accent' | 'mute' }) {
  return (
    <span className={`bar bar--${tone}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.pct} aria-label={`${p.done} de ${p.total} atividades`}>
      <i style={{ width: `${p.pct}%` }} />
    </span>
  )
}

export const Dot = ({ color }: { color: string }) => <i className="dot" style={{ background: color }} />

