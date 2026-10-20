import { BACKLOG, DONE, PROGRESS, REVIEW, TOTAL } from '../data'
import CountUp from '../components/CountUp'
import { idx, type SectionProps } from './types'

const S = (i: number) => ({ '--i': i }) as React.CSSProperties

export default function Where({ visible, open, n }: SectionProps) {
  const items = [
    { k: 'done', n: DONE.length, l: 'concluídas', t: 'Da T-001 à T-011 e a T-014', ids: DONE.map((t) => t.id), title: 'Concluídas' },
    { k: 'review', n: REVIEW.length, l: 'em revisão', t: 'T-012 e T-013, com CI verde', ids: REVIEW.map((t) => t.id), title: 'Aguardando revisão' },
    { k: 'progress', n: PROGRESS.length, l: 'em desenvolvimento', t: 'T-015', ids: PROGRESS.map((t) => t.id), title: 'Em desenvolvimento' },
    { k: 'backlog', n: BACKLOG.length, l: 'no Backlog', t: 'Da T-016 à T-027', ids: BACKLOG.map((t) => t.id), title: 'Backlog' },
  ]
  const color: Record<string, string> = { done: 'var(--ok)', review: 'var(--accent)', progress: 'var(--warn)', backlog: 'rgba(170,179,194,.55)' }
  return (
    <div className="container">
      <p className="index rise" style={S(0)}>{idx(n)}</p>
      <p className="eyebrow rise" style={S(1)}>Onde estamos</p>
      <h2 className="title rise" style={S(2)}>Doze entregas prontas. Doze pela frente.</h2>
      <ul className="stats">
        {items.map((it, i) => (
          <li key={it.k} className="rise" style={S(3 + i)}>
            <button className={`stat stat--${it.k}`} onClick={() => open({ kind: 'group', title: it.title, ids: it.ids })} aria-label={`${it.n} ${it.l}. Ver tarefas`}>
              <span className="stat__n"><CountUp to={it.n} active={visible} delay={0.15 + i * 0.1} /></span>
              <span className="stat__l">{it.l}</span>
              <span className="stat__t">{it.t}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="meter rise" style={S(7)} aria-hidden="true">
        {items.map((it, i) => (
          <i key={it.k} style={{ flex: it.n / TOTAL, background: color[it.k], '--i': i } as React.CSSProperties} />
        ))}
      </div>
      <p className="note rise" style={S(8)}>T-012 e T-013 estão publicadas e aguardando revisão. Toque em um número para ver as tarefas.</p>
    </div>
  )
}
