import { BACKLOG, COLOR, LOAD, PEOPLE, ROLE, TOTAL_SCORE, type Person } from '../data'
import { idx, type SectionProps } from './types'

const S = (i: number) => ({ '--i': i }) as React.CSSProperties

function Block({ p, lead, open }: { p: Person; lead?: boolean; open: SectionProps['open'] }) {
  const tasks = BACKLOG.filter((t) => t.owner === p).sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  return (
    <section className={`person ${lead ? 'person--lead' : ''}`} aria-label={`${p}: ${tasks.length} tarefas`}>
      <div className="person__head">
        <div>
          <h3 className="person__name" style={{ color: COLOR[p] }}>{p}</h3>
          <p className="person__role">{ROLE[p]}</p>
        </div>
        <span className="person__n" style={{ color: COLOR[p] }}>{tasks.length}</span>
      </div>
      <ul className="tasks">
        {tasks.map((t) => (
          <li key={t.id}>
            <button onClick={() => open({ kind: 'task', id: t.id })}>
              <span className="code">{t.id}</span>
              <span>{t.short}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Split({ open, n }: SectionProps) {
  const [lead, ...others] = PEOPLE
  return (
    <div className="container container--wide">
      <p className="index rise" style={S(0)}>{idx(n)}</p>
      <p className="eyebrow rise" style={S(1)}>A divisão</p>
      <h2 className="title title--sm rise" style={S(2)}>Quem faz o quê.</h2>
      <div className="split">
        <div className="rise" style={S(3)}>
          <Block p={lead} lead open={open} />
        </div>
        <div className="rest">
          {others.map((p, i) => (
            <div key={p} className="rise" style={S(4 + i)}>
              <Block p={p} open={open} />
            </div>
          ))}
        </div>
      </div>
      <div className="rise" style={S(8)}>
        <div className="share" aria-hidden="true">
          {LOAD.map((l, i) => (
            <i key={l.person} style={{ flex: l.score / TOTAL_SCORE, background: COLOR[l.person], '--i': i } as React.CSSProperties} />
          ))}
        </div>
        <div className="share-legend">
          <span>Dificuldade somada:</span>
          {LOAD.map((l) => (
            <span key={l.person}>
              <i className="dot" style={{ background: COLOR[l.person], marginRight: 6 }} />
              {l.person} {Math.round((l.score / TOTAL_SCORE) * 100)}%
            </span>
          ))}
        </div>
        <p className="note">Aprovada por Lukas e aplicada nas issues do GitHub em 19/10.</p>
      </div>
    </div>
  )
}
