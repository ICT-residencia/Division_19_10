export type Person = 'Lukas' | 'Gabriel' | 'Alison' | 'Kaique'
export type Board = 'Done' | 'In review' | 'In progress' | 'Backlog'

export interface Task {
  id: string
  title: string
  short: string
  owner: Person
  board: Board
  /** pontuação de complexidade, 0 a 100 (só as 12 tasks do Backlog) */
  score?: number
  /** esforço estimado em dias, [mínimo, máximo] */
  days?: [number, number]
  deps: string[]
}

/** Estados lidos das issues e PRs do GitHub em 19/10/2026. As colunas In review e In progress são o último estado informado. */
export const TASKS: Task[] = [
  { id: 'T-012', title: 'Login, emissão de JWT e guard', short: 'Login e JWT', owner: 'Lukas', board: 'In review', deps: [] },
  { id: 'T-013', title: 'Models de domínio', short: 'Models de domínio', owner: 'Lukas', board: 'In review', deps: [] },
  { id: 'T-015', title: 'Sessão de login, cookie e logout', short: 'Sessão e logout', owner: 'Kaique', board: 'In progress', deps: [] },
  { id: 'T-016', title: 'Gate de 80% de cobertura dos contratos na CI', short: 'Gate de cobertura', owner: 'Kaique', board: 'Backlog', score: 12, days: [0.5, 1], deps: [] },
  { id: 'T-017', title: 'ABI e bytecode do contrato em packages/shared', short: 'ABI e bytecode', owner: 'Alison', board: 'Backlog', score: 38.5, days: [2, 3], deps: [] },
  { id: 'T-018', title: 'Script de deploy e bootstrap de papéis', short: 'Deploy e papéis', owner: 'Gabriel', board: 'Backlog', score: 29, days: [1, 2], deps: [] },
  { id: 'T-019', title: 'Script de onboarding de ICT e concessão de ICT_ROLE', short: 'Onboarding de ICT', owner: 'Gabriel', board: 'Backlog', score: 45.5, days: [2, 3], deps: ['T-018'] },
  { id: 'T-020', title: 'Módulo de leitura pública da chain na API', short: 'Leitura da chain', owner: 'Alison', board: 'Backlog', score: 52, days: [2, 3], deps: ['T-017'] },
  { id: 'T-021', title: 'Módulo de signers operacionais', short: 'Signers', owner: 'Lukas', board: 'Backlog', score: 76.5, days: [3, 4], deps: ['T-012', 'T-017', 'T-020'] },
  { id: 'T-022', title: 'Cadastro de ICT off-chain e geração do ictRef', short: 'Cadastro de ICT', owner: 'Lukas', board: 'Backlog', score: 60, days: [3, 4], deps: ['T-012', 'T-013'] },
  { id: 'T-023', title: 'Registro on-chain da ICT pelo backend', short: 'Registro on-chain', owner: 'Lukas', board: 'Backlog', score: 89, days: [4, 5], deps: ['T-019', 'T-020', 'T-021', 'T-022'] },
  { id: 'T-024', title: 'Leitor de eventos do contrato com checkpoint', short: 'Leitor de eventos', owner: 'Lukas', board: 'Backlog', score: 61.5, days: [3, 4], deps: ['T-017', 'T-020'] },
  { id: 'T-025', title: 'Projeção do evento ICTRegistered', short: 'Projeção de evento', owner: 'Lukas', board: 'Backlog', score: 59.5, days: [2, 3], deps: ['T-024', 'T-013'] },
  { id: 'T-026', title: 'Upload dos documentos e hash do conjunto documental', short: 'Upload e hash', owner: 'Lukas', board: 'Backlog', score: 58, days: [3, 4], deps: ['T-012', 'T-013'] },
  { id: 'T-027', title: 'Tela de cadastro de ICT', short: 'Tela de cadastro', owner: 'Kaique', board: 'Backlog', score: 48.5, days: [3, 4], deps: ['T-015', 'T-022', 'T-023'] },
]

export const PEOPLE: Person[] = ['Lukas', 'Gabriel', 'Alison', 'Kaique']

export const COLOR: Record<Person, string> = {
  Lukas: 'var(--color-lukas)',
  Gabriel: 'var(--color-gabriel)',
  Alison: 'var(--color-alison)',
  Kaique: 'var(--color-kaique)',
}

export const ROLE: Record<Person, string> = {
  Lukas: 'Arquitetura, API e segurança',
  Gabriel: 'Contratos',
  Alison: 'Base da API e custódia',
  Kaique: 'Frontend',
}

export const BACKLOG = TASKS.filter((t) => t.score !== undefined)
export const RANKED = [...BACKLOG].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
export const mid = (t: Task) => (t.days ? (t.days[0] + t.days[1]) / 2 : 0)
export const fmt = (n: number) => String(n).replace('.', ',')
export const byId = (id: string) => TASKS.find((t) => t.id === id)!

export const CRITICAL = ['T-017', 'T-020', 'T-021', 'T-023', 'T-027']
export const CRITICAL_DAYS = CRITICAL.reduce((s, id) => s + mid(byId(id)), 0)

export const LOAD = PEOPLE.map((p) => {
  const mine = BACKLOG.filter((t) => t.owner === p)
  return { person: p, tasks: mine, days: mine.reduce((s, t) => s + mid(t), 0) }
})
export const TOTAL_DAYS = LOAD.reduce((s, l) => s + l.days, 0)
