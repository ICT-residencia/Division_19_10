import { BACKLOG, byId, stateOf } from '../data'
import { idx, type SectionProps } from './types'

const S = (i: number) => ({ '--i': i }) as React.CSSProperties

export default function Next({ open, n }: SectionProps) {
  const now = BACKLOG.filter((t) => stateOf(t) === 'ready').map((t) => t.id)
  const later = BACKLOG.filter((t) => stateOf(t) === 'blocked' && t.id !== 'T-027').map((t) => t.id)
  const moments = [
    {
      k: 'Agora', cls: 'moment--now', t: 'O que pode avançar já.',
      ids: [...now, 'T-015', 'T-012', 'T-013'], ok: new Set(['T-015', 'T-012', 'T-013', ...now]),
      d: 'T-015 segue em desenvolvimento, T-012 e T-013 em revisão. T-016, T-017 e T-018 não esperam ninguém.',
    },
    { k: 'Em seguida', cls: '', t: 'O que espera uma dependência.', ids: later, ok: new Set<string>(), d: 'Cada uma começa quando a anterior é integrada. T-026 também espera uma decisão.' },
    { k: 'Conclusão', cls: '', t: 'Integração e encerramento do ciclo.', ids: ['T-027'], ok: new Set<string>(), d: 'A tela de cadastro fecha o caminho crítico: aprovação, merge e o ciclo encerrado.' },
  ]
  return (
    <div className="container">
      <div className="closing">
        <p className="index rise" style={S(0)}>{idx(n)}</p>
        <p className="eyebrow rise" style={S(1)}>Próximos passos</p>
      </div>
      <ul className="moments">
        {moments.map((m, i) => (
          <li key={m.k} className={`moment ${m.cls} rise`} style={S(2 + i)}>
            <p className="moment__k">{m.k}</p>
            <p className="moment__t">{m.t}</p>
            <div className="moment__codes">
              {m.ids.map((id) => (
                <button key={id} className={`chip ${m.ok.has(id) ? 'chip--ok' : ''}`} onClick={() => open({ kind: 'task', id })} title={byId(id).short}>
                  {id}
                </button>
              ))}
            </div>
            <p className="note" style={{ marginTop: 14 }}>{m.d}</p>
          </li>
        ))}
      </ul>
      <div className="closing" style={{ marginTop: 'clamp(2.4rem, 8vh, 5rem)' }}>
        <h2 className="title rise" style={S(6)}>Da arquitetura à entrega. Um fluxo, quatro desenvolvedores.</h2>
        <div className="footlinks rise" style={{ ...S(7), marginTop: 'clamp(1.6rem, 4vh, 2.4rem)' }}>
          <button className="more" style={{ marginTop: 0 }} onClick={() => open({ kind: 'history' })}>Histórico detalhado</button>
          <button className="more" style={{ marginTop: 0 }} onClick={() => open({ kind: 'sources' })}>Fontes</button>
        </div>
      </div>
    </div>
  )
}
