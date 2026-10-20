import { useState } from 'react'
import { BACKLOG, COLOR, PEOPLE, ROLE, byId, openDeps, stateOf, type Person } from '../data'
import { nextPending, progressOf, useSaved, type Progress } from '../store'
import { Bar, Dot, Rich, StatusPill } from '../components/ui'
import { DataTools } from '../components/panels'
import { idx, type SectionProps } from './types'

const S = (i: number) => ({ '--i': i }) as React.CSSProperties

const tasksOf = (p: Person) => BACKLOG.filter((t) => t.owner === p).sort((a, b) => a.id.localeCompare(b.id))
const sum = (list: Progress[]): Progress => {
  const done = list.reduce((s, x) => s + x.done, 0)
  const total = list.reduce((s, x) => s + x.total, 0)
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 }
}

export default function Execution({ open, n }: SectionProps) {
  const saved = useSaved()
  const [who, setWho] = useState<Person>('Lukas')
  const mine = tasksOf(who)
  const total = sum(mine.map((t) => progressOf(saved, t.id)))
  const confirmed = mine.every((t) => t.gh.includes(who))

  // "agora": a primeira tarefa que já pode andar; se todas esperam, o que falta
  const active = mine.find((t) => ['progress', 'review', 'ready'].includes(stateOf(t)))
  const now = active ? nextPending(saved, active.id) : null
  const waiting = [...new Set(mine.flatMap((t) => openDeps(t)).filter((d) => byId(d).owner !== who))]

  return (
    <div className="container container--wide">
      <div className="ex">
        <div className="ex__side">
          <p className="index rise" style={S(0)}>{idx(n)}</p>
          <p className="eyebrow rise" style={S(1)}>Execução por responsável</p>
          <h2 className="title title--sm rise" style={S(2)}>Cada pessoa sabe exatamente o que entregar.</h2>
          <div className="pick rise" style={S(3)} role="tablist" aria-label="Responsável">
            {PEOPLE.map((p) => {
              const t = tasksOf(p)
              const pr = sum(t.map((x) => progressOf(saved, x.id)))
              return (
                <button key={p} role="tab" aria-selected={who === p} className={who === p ? 'is-on' : ''} onClick={() => setWho(p)} style={{ '--c': COLOR[p] } as React.CSSProperties}>
                  <span className="pick__n">{t.length}</span>
                  <span className="pick__name">{p}<small>{pr.done} de {pr.total} atividades</small></span>
                </button>
              )
            })}
          </div>
          <div className="rise" style={S(4)}><DataTools /></div>
          <p className="note rise" style={S(5)}>
            Distribuição 4/3/3/2 aprovada por Lukas e aplicada nas issues em 19/10/2026. As marcações são locais e não alteram o GitHub.
          </p>
        </div>

        <div className="ex__main rise" style={S(3)} role="tabpanel" aria-label={`Tarefas de ${who}`}>
          <header className="ex__head">
            <div>
              <h3 style={{ color: COLOR[who] }}>{who}</h3>
              <p>{ROLE[who]} · {confirmed ? 'atribuições confirmadas no GitHub' : 'atribuições ainda não aplicadas no GitHub'}</p>
            </div>
            <div className="ex__total">
              <b>{total.done}</b> de {total.total} atividades · {total.pct}%
              <Bar p={total} />
            </div>
          </header>

          <div className="now">
            <span className="now__k">Agora</span>
            {active && now ? (
              <p>
                Trabalhar na{' '}
                <button className="code-link" onClick={() => open({ kind: 'task', id: active.id })}>{active.id}</button>{' '}
                {active.short}. A próxima atividade está na linha dela.
              </p>
            ) : (
              <p>Aguardando {waiting.length ? waiting.join(', ') : 'dependências'} antes de começar.</p>
            )}
          </div>

          <ul className="xrows">
            {mine.map((t) => {
              const p = progressOf(saved, t.id)
              const np = nextPending(saved, t.id)
              const wait = openDeps(t)
              const st = stateOf(t)
              return (
                <li key={t.id} className={`xrow xrow--${st}`}>
                  <div className="xrow__top">
                    <span className="code">{t.id}</span>
                    <strong>{t.short}</strong>
                    <StatusPill task={t} compact />
                  </div>
                  <p className="xrow__next">
                    <i>Próxima atividade</i>
                    {np ? <Rich text={np.item.text} /> : 'Checklist completo.'}
                  </p>
                  <div className="xrow__foot">
                    <span className="deps">
                      {wait.length ? (
                        <>
                          Espera{' '}
                          {wait.map((d) => (
                            <button key={d} className="chip" onClick={() => open({ kind: 'task', id: d })} title={byId(d).short}>
                              {d} · {byId(d).owner}
                            </button>
                          ))}
                        </>
                      ) : t.deps.length ? (
                        'Dependências concluídas'
                      ) : (
                        'Sem dependências'
                      )}
                      {t.blockedByDecision && <em>Aguarda decisão</em>}
                    </span>
                    <span className="xrow__prog">
                      <Bar p={p} />
                      <span>{p.done} de {p.total} · {p.pct}%</span>
                    </span>
                    <button className="more" style={{ marginTop: 0 }} onClick={() => open({ kind: 'task', id: t.id })}>Abrir checklist →</button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
