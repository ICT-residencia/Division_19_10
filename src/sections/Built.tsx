import { COLOR, DONE, FRONTS, PEOPLE, type Person } from '../data'
import { idx, type SectionProps } from './types'

const S = (i: number) => ({ '--i': i }) as React.CSSProperties

/** pessoas que aparecem como autoras da frente, pela implementação registrada */
const authors = (front: string): Person[] =>
  PEOPLE.filter((p) => DONE.some((t) => t.front === front && (t.impl ?? '').includes(p)))

export default function Built({ open, n }: SectionProps) {
  return (
    <div className="container">
      <p className="index rise" style={S(0)}>{idx(n)}</p>
      <p className="eyebrow rise" style={S(1)}>O que já construímos</p>
      <h2 className="title rise" style={S(2)}>Quatro frentes, doze entregas.</h2>
      <ul className="fronts">
        {FRONTS.map((f, i) => {
          const count = DONE.filter((t) => t.front === f.id).length
          return (
            <li key={f.id} className="rise" style={S(3 + i)}>
              <button className="front" onClick={() => open({ kind: 'front', id: f.id })} aria-label={`${f.name}: ${count} entregas. Ver detalhes`}>
                <span className="front__n">{count}</span>
                <span className="front__name">{f.name}</span>
                <span className="front__line">{f.line}</span>
                <span className="front__who">
                  {authors(f.id).map((p) => (
                    <span key={p}><i className="dot" style={{ background: COLOR[p] }} />{p}</span>
                  ))}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <button className="more rise" style={S(8)} onClick={() => open({ kind: 'history' })}>
        Ver o histórico completo <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}
