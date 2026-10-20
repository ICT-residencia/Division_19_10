import raw from './issues.json'
import { TASKS, byId, type Task } from '../data'

/**
 * Checklists por tarefa, construídas a partir do texto oficial das issues (src/data/issues.json,
 * gerado por scripts/parse-issues.mjs). Nada aqui é genérico: cada item vem de um critério de
 * aceite, da evidência esperada ou do processo de integração da equipe.
 */
export interface Item {
  id: string
  text: string
  /** de onde o item vem */
  source: string
  /** comprovado no GitHub: já nasce marcado */
  verified?: boolean
}
export interface Group {
  id: string
  title: string
  items: Item[]
}
interface RawDoc {
  issue: number
  title: string
  state: string
  objective: string
  depends: string
  groups: { title: string; items: { id: string; text: string }[] }[]
  warnings: string[]
  failures: string[]
  evidence: string
  decisions: string
}
const DOCS = raw as unknown as Record<string, RawDoc>

/** PRs mergeadas na main que entregaram cada tarefa concluída (lidas do GitHub). */
export const MERGED: Record<string, number[]> = {
  'T-002': [5], 'T-003': [6], 'T-004': [7], 'T-005': [20], 'T-006': [21], 'T-007': [22],
  'T-008': [23], 'T-009': [24], 'T-010': [25], 'T-011': [40, 41], 'T-014': [26],
}

export const docOf = (id: string) => DOCS[id]

const short = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s)

function build(t: Task): Group[] {
  const d = DOCS[t.id]
  const src = `Issue #${t.issue}`
  const groups: Group[] = d.groups.map((g, gi) => ({
    id: `g${gi}`,
    title: g.title,
    items: g.items.map((it) => ({ id: it.id, text: it.text, source: `${src} · ${g.title}` })),
  }))

  if (t.board === 'Done') {
    const merged = MERGED[t.id]
    if (merged?.length) {
      groups.push({
        id: 'int',
        title: 'Integração',
        items: [{ id: 'merge', text: `${merged.map((n) => `PR #${n}`).join(' e ')} mergeada${merged.length > 1 ? 's' : ''} na main`, source: 'GitHub · PR', verified: true }],
      })
    }
    return groups
  }

  if (d.evidence) {
    groups.push({
      id: 'ev',
      title: 'Evidência esperada',
      items: [{ id: 'evidence', text: `Evidência entregue na PR: ${short(d.evidence, 260)}`, source: `${src} · Evidência esperada` }],
    })
  }
  const pr = t.prs[0]
  const hasPr = pr !== undefined
  groups.push({
    id: 'int',
    title: 'Revisão e integração',
    items: [
      { id: 'pr', text: hasPr ? `PR #${pr} publicada para revisão` : 'PR publicada para revisão', source: 'Processo da equipe · uma task, uma PR', verified: hasPr },
      { id: 'ci', text: 'CI verde (jobs contracts e apps)', source: hasPr ? 'GitHub · checks da PR' : 'Processo da equipe', verified: hasPr },
      { id: 'review', text: 'Revisão aprovada pela mentoria', source: 'Processo da equipe · revisão obrigatória' },
      { id: 'merge', text: 'Merge na main pela mentoria', source: 'Processo da equipe · integração' },
    ],
  })
  return groups
}

export const CHECKLISTS: Record<string, Group[]> = Object.fromEntries(TASKS.map((t) => [t.id, build(t)]))

export const itemsOf = (id: string) => CHECKLISTS[id].flatMap((g) => g.items)
export const defaultChecked = (it: Item) => !!it.verified

export const taskIds = TASKS.map((t) => t.id).sort()
export const taskByCode = byId
