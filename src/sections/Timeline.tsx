import { useState } from 'react'
import { COLOR, TASKS, openDeps, stateOf, type Task } from '../data'
import { progressOf, useSaved } from '../store'
import { Bar, Dot, StatusPill } from '../components/ui'
import { idx, type SectionProps } from './types'

const S = (i: number) => ({ '--i': i }) as React.CSSProperties
const num = (t: Task) => Number(t.id.slice(2))
const ALL = [...TASKS].sort((a, b) => num(a) - num(b))

const GROUPS = [
  { id: 'g1', name: 'Base e decisões', from: 1, to: 5 },
  { id: 'g2', name: 'Contrato do MVP', from: 6, to: 10 },
  { id: 'g3', name: 'API e área interna', from: 11, to: 15 },
  { id: 'g4', name: 'Infra, ABI e leitura', from: 16, to: 20 },
  { id: 'g5', name: 'Núcleo on-chain e tela', from: 21, to: 27 },
].map((g) => ({ ...g, tasks: ALL.filter((t) => num(t) >= g.from && num(t) <= g.to) }))

const code = (n: number) => `T-${String(n).padStart(3, '0')}`

/** o que impede ou acompanha a tarefa, em poucas palavras */
function note(t: Task): string {
  const st = stateOf(t)
  if (st === 'blocked') {
    const w = openDeps(t)
    return t.blockedByDecision && !w.length ? 'Aguarda decisão' : `Aguarda ${w.join(', ')}`
  }
  if (st === 'review') return `PR #${t.prs[0]}`
  if (st === 'done') return `Fechada em ${t.closed}`
  if (st === 'ready') return 'Pode começar'
  return ''
}

export default function Timeline({ open, n }: SectionProps) {
  const saved = useSaved()
  const firstOpen = ALL.find((t) => t.board !== 'Done')
  const initial = GROUPS.find((g) => firstOpen && g.tasks.includes(firstOpen))?.id ?? GROUPS[0].id
  const [openId, setOpenId] = useState(initial)

  const count = (f: (t: Task) => boolean) => ALL.filter(f).length
  const done = count((t) => stateOf(t) === 'done')
  const review = count((t) => stateOf(t) === 'review')
  const doing = count((t) => stateOf(t) === 'progress')
  const blocked = count((t) => stateOf(t) === 'blocked')
  const ready = count((t) => stateOf(t) === 'ready')

  return (
    <div className="container container--wide">
      <div className="tl">
        <div className="tl__side">
          <p className="index rise" style={S(0)}>{idx(n)}</p>
          <p className="eyebrow rise" style={S(1)}>O fluxo</p>
          <h2 className="title title--sm rise" style={S(2)}>Da primeira tarefa à última entrega.</h2>
          <div className="tl__sum rise" style={S(3)}>
            <div><b style={{ color: 'var(--ok)' }}>{done}</b><span>Concluídas</span></div>
            <div><b style={{ color: 'var(--warn)' }}>{review + doing}</b><span>Em progresso<small>{review} em revisão</small></span></div>
            <div><b>{blocked + ready}</b><span>Pendentes<small>{blocked} bloqueadas</small></span></div>
          </div>
          <div className="ticks rise" style={S(4)} role="group" aria-label={`As ${ALL.length} tarefas, em ordem`}>
            {ALL.map((t) => (
              <button key={t.id} className={`tick tick--${stateOf(t)}`} onClick={() => open({ kind: 'task', id: t.id })} title={`${t.id} · ${t.short}`} aria-label={`${t.id} ${t.short}`} />
            ))}
          </div>
          <p className="note rise" style={S(5)}>Em ordem numérica, de T-001 a T-027. As dependências aparecem dentro de cada tarefa.</p>
        </div>

        <div className="tl__list rise" style={S(3)}>
          {GROUPS.map((g) => {
            const isOpen = openId === g.id
            const finished = g.tasks.filter((t) => stateOf(t) === 'done').length
            return (
              <section key={g.id} className={`acc ${isOpen ? 'is-open' : ''}`}>
                <button className="acc__head" aria-expanded={isOpen} aria-controls={`${g.id}-body`} onClick={() => setOpenId(isOpen ? '' : g.id)}>
                  <span className="acc__range">{code(g.from)} a {code(g.to)}</span>
                  <span className="acc__name">{g.name}</span>
                  <span className="acc__mini" aria-hidden="true">
                    {g.tasks.map((t) => <i key={t.id} className={`tick tick--${stateOf(t)}`} />)}
                  </span>
                  <span className="acc__count">{finished}/{g.tasks.length}</span>
                  <span className="acc__chev" aria-hidden="true" />
                </button>
                {isOpen && (
                  <ol id={`${g.id}-body`} className="acc__body">
                    {g.tasks.map((t) => {
                      const st = stateOf(t)
                      const p = progressOf(saved, t.id)
                      return (
                        <li key={t.id} className={`trow trow--${st}`}>
                          <button onClick={() => open({ kind: 'task', id: t.id })} aria-label={`${t.id} ${t.short}. Abrir detalhes`}>
                            <span className="trow__code">{t.id}</span>
                            <span className="trow__title">{t.short}<small>{note(t)}</small></span>
                            <span className="trow__who"><Dot color={COLOR[t.owner]} />{t.owner}</span>
                            <span className="trow__st"><StatusPill task={t} compact /></span>
                            <span className="trow__prog">
                              {st === 'done' ? (
                                <small>Encerrada</small>
                              ) : (
                                <>
                                  <Bar p={p} />
                                  <small>{p.done}/{p.total}</small>
                                </>
                              )}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ol>
                )}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
