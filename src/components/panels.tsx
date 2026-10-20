import { useRef, useState } from 'react'
import {
  COLOR, DONE, FRONTS, LEVEL, SNAPSHOT, TASKS, byId, fmt, issueUrl, levelOf, openDeps, prUrl, stateOf,
  type Front, type Task,
} from '../data'
import { CHECKLISTS, MERGED, defaultChecked, docOf } from '../data/checklists'
import { downloadExport, importFromText, isChecked, progressOf, setChecked, setNote, useSaved } from '../store'
import { Bar, Dot, Rich, STATUS, StatusPill } from './ui'

export type Panel =
  | { kind: 'task'; id: string }
  | { kind: 'front'; id: Front }
  | { kind: 'group'; title: string; ids: string[] }
  | { kind: 'history' }
  | { kind: 'sources' }

type Open = (p: Panel) => void

const TaskLinks = ({ t }: { t: Task }) => {
  const prs = t.board === 'Done' ? (MERGED[t.id] ?? t.prs) : t.prs
  return (
    <div className="links">
      <a href={issueUrl(t.issue)} target="_blank" rel="noopener noreferrer">Issue #{t.issue} ↗</a>
      {prs.map((n) => (
        <a key={n} href={prUrl(n)} target="_blank" rel="noopener noreferrer">PR #{n} ↗</a>
      ))}
    </div>
  )
}

/** Painel de uma tarefa: checklist real (critérios das issues), progresso local e notas. */
export function TaskPanel({ id, open }: { id: string; open: Open }) {
  const t = byId(id)
  const saved = useSaved()
  const doc = docOf(id)
  const groups = CHECKLISTS[id]
  const p = progressOf(saved, id)
  const st = stateOf(t)
  const done = st === 'done'
  const wait = openDeps(t)
  const gh = t.gh.length ? t.gh.join(' e ') : 'ninguém'

  return (
    <>
      <p className="eyebrow">{t.id}</p>
      <h3>{t.title}</h3>
      <p style={{ marginTop: 14 }}><StatusPill task={t} /></p>

      <dl className="kv">
        <dt>Responsável</dt>
        <dd>
          <Dot color={COLOR[t.owner]} />{done ? t.origin : t.owner}
          <small>{t.gh.length ? `Atribuída no GitHub a ${gh}.` : 'Sem responsável no GitHub.'}</small>
        </dd>
        <dt>Dependências</dt>
        <dd>
          {t.deps.length === 0 ? (
            doc.depends || 'Nenhuma dependência declarada.'
          ) : (
            <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {t.deps.map((d) => (
                <button key={d} className={`chip ${byId(d).board === 'Done' ? 'chip--ok' : ''}`} onClick={() => open({ kind: 'task', id: d })} title={byId(d).short}>
                  {d}
                </button>
              ))}
            </span>
          )}
          {t.deps.length > 0 && (
            <small>{doc.depends ? `${doc.depends} ` : ''}{wait.length === 0 ? 'Todas concluídas.' : `Faltam: ${wait.join(', ')}.`}</small>
          )}
        </dd>
        {t.score !== undefined && (
          <>
            <dt>Dificuldade</dt>
            <dd>{LEVEL[levelOf(t.score)]} · {fmt(t.score)}<small>Esforço estimado: {fmt(t.days![0])} a {fmt(t.days![1])} dias.</small></dd>
          </>
        )}
        {done && (<><dt>Entrega</dt><dd>{t.work}<small>{t.impl}. Fechada em {t.closed}.</small></dd></>)}
        {t.review && (<><dt>Revisão</dt><dd>{t.review}</dd></>)}
        {(t.blockedByDecision || t.decision) && (<><dt>Decisão</dt><dd>{t.blockedByDecision ?? t.decision}</dd></>)}
      </dl>

      <section className="check" aria-label="Checklist">
        <div className="check__head">
          <h4>O que precisa ser feito</h4>
          <span className="check__count">
            {p.done} de {p.total} atividades concluídas
            <b>{p.pct}%</b>
          </span>
        </div>
        <Bar p={p} />
        {done && <p className="note" style={{ marginTop: 10 }}>Tarefa encerrada. Só o que está comprovado no GitHub vem marcado; o resto está como não verificado.</p>}
        {doc.warnings.map((w) => (
          <p key={w} className="callout">{w}</p>
        ))}
        {groups.map((g) => (
          <fieldset key={g.id} className="group">
            <legend>{g.title}</legend>
            {g.items.map((it) => {
              const fb = defaultChecked(it)
              const on = isChecked(saved, id, it.id, fb)
              return (
                <label key={it.id} className={`item ${on ? 'is-on' : ''}`}>
                  <input type="checkbox" checked={on} onChange={(e) => setChecked(id, it.id, e.target.checked, fb)} />
                  <span className="item__box" aria-hidden="true" />
                  <span className="item__text">
                    <Rich text={it.text} />
                    <small>
                      {it.source}
                      {it.verified && ' · comprovado'}
                      {done && !it.verified && !on && ' · não verificado'}
                    </small>
                  </span>
                </label>
              )
            })}
          </fieldset>
        ))}
      </section>

      <details className="orig">
        <summary>Descrição original da issue</summary>
        {doc.objective && <p><Rich text={doc.objective} /></p>}
        {doc.decisions && <p className="note"><Rich text={doc.decisions} /></p>}
        {doc.failures.length > 0 && (
          <>
            <h5>Cenários de falha</h5>
            <ul>{doc.failures.map((f) => <li key={f}><Rich text={f} /></li>)}</ul>
          </>
        )}
        <p className="note">Fonte: issue #{t.issue}, lida em {SNAPSHOT}.</p>
      </details>

      <label className="notes">
        <span>Notas de execução</span>
        <textarea
          defaultValue={saved.notes[id] ?? ''}
          key={id}
          placeholder="Anotações só deste navegador"
          rows={3}
          maxLength={5000}
          onChange={(e) => setNote(id, e.target.value)}
        />
      </label>

      <TaskLinks t={t} />
      <p className="note local">As marcações ficam salvas só neste navegador e não alteram o GitHub.</p>
    </>
  )
}

export function GroupPanel({ title, ids, open }: { title: string; ids: string[]; open: Open }) {
  return (
    <>
      <p className="eyebrow">Tarefas</p>
      <h3>{title}</h3>
      <ul className="list">
        {ids.map((id) => {
          const t = byId(id)
          return (
            <li key={id}>
              <button className="t" onClick={() => open({ kind: 'task', id })} style={{ textAlign: 'left' }}>
                <span className="code">{t.id}</span>
                <span>{t.title}</span>
              </button>
              <p className="m">{t.owner} · {STATUS[stateOf(t)].main}</p>
            </li>
          )
        })}
      </ul>
    </>
  )
}

const HistoryItem = ({ t, open }: { t: Task; open: Open }) => (
  <li>
    <button className="t" onClick={() => open({ kind: 'task', id: t.id })} style={{ textAlign: 'left' }}>
      <span className="code">{t.id}</span>
      <span>{t.title}</span>
    </button>
    <p className="m"><b>Responsável original:</b> {t.origin}</p>
    <p className="m"><b>Implementação:</b> {t.impl}</p>
    <p className="m">
      <b>PR:</b> {t.prs.length ? t.prs.map((n) => `#${n}`).join(', ') : 'sem PR'} · <b>fechada em</b> {t.closed}
    </p>
  </li>
)

export function FrontPanel({ id, open }: { id: Front; open: Open }) {
  const f = FRONTS.find((x) => x.id === id)!
  const items = DONE.filter((t) => t.front === id)
  return (
    <>
      <p className="eyebrow">O que já construímos</p>
      <h3>{f.name}</h3>
      <ul className="list">{items.map((t) => <HistoryItem key={t.id} t={t} open={open} />)}</ul>
    </>
  )
}

export function HistoryPanel({ open }: { open: Open }) {
  return (
    <>
      <p className="eyebrow">Histórico</p>
      <h3>As 12 entregas concluídas</h3>
      <ul className="list">{DONE.map((t) => <HistoryItem key={t.id} t={t} open={open} />)}</ul>
    </>
  )
}

/** Exportar e importar as marcações locais (JSON). */
export function DataTools() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const onFile = async (f: File | undefined) => {
    if (!f) return
    const r = importFromText(await f.text())
    setMsg({ ok: r.ok, text: r.message })
    if (inputRef.current) inputRef.current.value = ''
  }
  return (
    <div className="tools">
      <button className="more" onClick={() => downloadExport()}>Exportar JSON</button>
      <button className="more" onClick={() => inputRef.current?.click()}>Importar JSON</button>
      <input ref={inputRef} type="file" accept="application/json,.json" hidden onChange={(e) => onFile(e.target.files?.[0])} />
      {msg && <p className={`tools__msg ${msg.ok ? 'ok' : 'err'}`} role="status">{msg.text}</p>}
    </div>
  )
}

export function SourcesPanel() {
  return (
    <>
      <p className="eyebrow">Fontes</p>
      <h3>De onde vêm os dados</h3>
      <ul className="srcs">
        <li>Issues e PRs do GitHub, lidos em {SNAPSHOT}. Os links abrem o repositório do MVP, que exige acesso de membro.</li>
        <li>As checklists vêm dos critérios de aceite e da evidência esperada de cada issue, mais as etapas de revisão e integração da equipe.</li>
        <li>As colunas In review e In progress do Project são o último estado informado: o Project não pôde ser lido com o token atual.</li>
        <li>A distribuição 4/3/3/2 foi aprovada por Lukas e aplicada nas issues T-016 a T-027 em {SNAPSHOT}.</li>
        <li>Dificuldade: arquitetura 30%, segurança 20%, dependências 20%, integração 20%, incerteza 10%. Os esforços são estimativas.</li>
        <li>Marcações e notas ficam só neste navegador. Não existe sincronização com o GitHub.</li>
      </ul>
      <DataTools />
      <div className="links">
        <a href="https://github.com/residenciaweb3/credenciamento-de-icts-mvp5" target="_blank" rel="noopener noreferrer">Repositório do MVP ↗</a>
        <a href="https://apresentation2809-n18v.vercel.app/" target="_blank" rel="noopener noreferrer">Apresentação oficial ↗</a>
      </div>
      <p className="note" style={{ marginTop: 24 }}>{TASKS.length} tarefas no inventário, de T-001 a T-027.</p>
    </>
  )
}

export function PanelBody({ panel, open }: { panel: Panel; open: Open }) {
  switch (panel.kind) {
    case 'task': return <TaskPanel id={panel.id} open={open} />
    case 'front': return <FrontPanel id={panel.id} open={open} />
    case 'group': return <GroupPanel title={panel.title} ids={panel.ids} open={open} />
    case 'history': return <HistoryPanel open={open} />
    case 'sources': return <SourcesPanel />
  }
}

export const panelLabel = (p: Panel) =>
  p.kind === 'task' ? `Detalhes de ${p.id}` : p.kind === 'front' ? 'Entregas da frente' : p.kind === 'group' ? p.title : p.kind === 'history' ? 'Histórico' : 'Fontes'
