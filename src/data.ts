/**
 * Dados do planejamento. Fonte: issues e PRs do GitHub lidos em 19/10/2026.
 * - `gh` é o responsável real no GitHub; `owner` é a distribuição 4/3/3/2 aprovada por Lukas e aplicada nas issues em 19/10/2026.
 * - As colunas In review e In progress são o último estado informado (o Project não pôde ser lido).
 */
export type Person = 'Lukas' | 'Gabriel' | 'Alison' | 'Kaique'
export type Board = 'Done' | 'In review' | 'In progress' | 'Backlog'
export type Level = 'baixa' | 'media' | 'alta' | 'critica'
export type Front = 'arquitetura' | 'contratos' | 'backend' | 'frontend'
export type Layer = 'contratos' | 'shared' | 'backend' | 'persistencia' | 'integracao' | 'frontend'

export const SNAPSHOT = '19/10/2026'
export const REPO = 'https://github.com/residenciaweb3/credenciamento-de-icts-mvp5'
export const issueUrl = (n: number) => `${REPO}/issues/${n}`
export const prUrl = (n: number) => `${REPO}/pull/${n}`

export interface Task {
  id: string
  issue: number
  title: string
  short: string
  owner: Person
  gh: Person[]
  board: Board
  deps: string[]
  prs: number[]
  layer: Layer
  /** pontuação de complexidade 0–100 (só as 12 tasks do Backlog) */
  score?: number
  days?: [number, number]
  /** decisão pendente que bloqueia o início */
  blockedByDecision?: string
  /** decisão pendente que não bloqueia */
  decision?: string
  /** histórico (só concluídas) */
  front?: Front
  origin?: string
  impl?: string
  work?: string
  closed?: string
  /** próxima ação */
  next: string
  review?: string
}

export const TASKS: Task[] = [
  // ---- concluídas ----
  { id: 'T-001', issue: 1, title: 'Preparar ambiente de desenvolvimento local', short: 'Ambiente local', owner: 'Lukas', gh: ['Lukas'], board: 'Done', deps: [], prs: [], layer: 'backend', front: 'backend', origin: 'Lukas', impl: 'Sem código ou PR para rastrear', work: 'Subir o ambiente local e rodar os gates da CI', closed: '31/08', next: 'Concluída.' },
  { id: 'T-002', issue: 2, title: 'ADR do contrato', short: 'ADR-001 do contrato', owner: 'Lukas', gh: ['Lukas'], board: 'Done', deps: [], prs: [5], layer: 'contratos', front: 'arquitetura', origin: 'Lukas', impl: 'Lukas', work: 'ADR-001: arquitetura do contrato, 644 linhas', closed: '10/09', next: 'Concluída.' },
  { id: 'T-003', issue: 3, title: 'Modelo de ameaças simplificado', short: 'Modelo de ameaças', owner: 'Lukas', gh: ['Lukas', 'Alison'], board: 'Done', deps: [], prs: [6], layer: 'contratos', front: 'arquitetura', origin: 'Lukas e Alison', impl: 'Lukas (a parte da Alison não aparece nos commits)', work: 'Modelo de ameaças do MVP', closed: '18/09', next: 'Concluída.' },
  { id: 'T-004', issue: 4, title: 'Landing page de apresentação do MVP', short: 'Landing page', owner: 'Kaique', gh: ['Kaique'], board: 'Done', deps: [], prs: [7], layer: 'frontend', front: 'frontend', origin: 'Kaique', impl: 'Kaique', work: 'Landing pública, 9 arquivos em apps/web', closed: '16/09', next: 'Concluída.' },
  { id: 'T-005', issue: 9, title: 'ADR-002: custódia de chaves e papéis', short: 'ADR-002 de custódia', owner: 'Alison', gh: ['Alison'], board: 'Done', deps: [], prs: [20], layer: 'backend', front: 'arquitetura', origin: 'Alison', impl: 'Alison', work: 'Custódia de chaves e mapeamento de papéis', closed: '01/10', next: 'Concluída.' },
  { id: 'T-006', issue: 10, title: 'Vínculo da ICT e registerICT', short: 'registerICT', owner: 'Gabriel', gh: ['Gabriel'], board: 'Done', deps: [], prs: [21], layer: 'contratos', front: 'contratos', origin: 'Gabriel', impl: 'Gabriel', work: 'Vínculo ICT–conta e registerICT, com testes', closed: '24/09', next: 'Concluída.' },
  { id: 'T-007', issue: 11, title: 'Solicitação de habilitação e decisão', short: 'Solicitação e decisão', owner: 'Gabriel', gh: ['Gabriel'], board: 'Done', deps: [], prs: [22], layer: 'contratos', front: 'contratos', origin: 'Gabriel', impl: 'Gabriel e Lukas (ajustes de revisão)', work: 'submitApplication e recordDecision', closed: '14/10', next: 'Concluída.' },
  { id: 'T-008', issue: 12, title: 'Ativação da habilitação', short: 'Ativação', owner: 'Lukas', gh: ['Lukas'], board: 'Done', deps: [], prs: [23], layer: 'contratos', front: 'contratos', origin: 'Lukas', impl: 'Lukas', work: 'activateAccreditation', closed: '16/10', next: 'Concluída.' },
  { id: 'T-009', issue: 13, title: 'Auditoria e renovação encadeada', short: 'Auditoria e renovação', owner: 'Lukas', gh: ['Lukas'], board: 'Done', deps: [], prs: [24], layer: 'contratos', front: 'contratos', origin: 'Lukas', impl: 'Lukas', work: 'Auditoria e renovação encadeada', closed: '16/10', next: 'Concluída.' },
  { id: 'T-010', issue: 14, title: 'Consulta pública do status atual', short: 'Consulta de status', owner: 'Lukas', gh: ['Lukas'], board: 'Done', deps: [], prs: [25], layer: 'contratos', front: 'contratos', origin: 'Lukas', impl: 'Lukas', work: 'getCurrentStatus, sete estados', closed: '16/10', next: 'Concluída.' },
  { id: 'T-011', issue: 15, title: 'Prisma no Nest, model User e seed', short: 'Base da API', owner: 'Alison', gh: ['Alison'], board: 'Done', deps: [], prs: [27, 40, 41], layer: 'persistencia', front: 'backend', origin: 'Alison', impl: 'Alison (Prisma, User, seed) e Lukas (CI e seed seguro)', work: 'Prisma no Nest, model User, seed e Argon2id', closed: '16/10', next: 'Concluída.' },
  { id: 'T-014', issue: 18, title: 'Casca do app com navegação lateral', short: 'Casca do app', owner: 'Kaique', gh: ['Kaique'], board: 'Done', deps: [], prs: [26], layer: 'frontend', front: 'frontend', origin: 'Kaique', impl: 'Kaique', work: 'Layout da área interna com navegação lateral', closed: '28/09', next: 'Concluída.' },

  // ---- em revisão e em andamento ----
  { id: 'T-012', issue: 16, title: 'Login, emissão de JWT e guard', short: 'Login e JWT', owner: 'Lukas', gh: ['Lukas'], board: 'In review', deps: [], prs: [43], layer: 'backend', next: 'Revisão e merge da PR #43. CI verde.', review: 'PR #43: CI verde, com comentário de revisão e sem aprovação registrada.' },
  { id: 'T-013', issue: 17, title: 'Models de domínio', short: 'Models de domínio', owner: 'Lukas', gh: ['Lukas'], board: 'In review', deps: [], prs: [44], layer: 'persistencia', next: 'Revisão e merge da PR #44. CI verde.', review: 'PR #44: CI verde e ainda sem revisão humana.' },
  { id: 'T-015', issue: 19, title: 'Sessão de login, cookie e logout', short: 'Sessão e logout', owner: 'Kaique', gh: ['Kaique'], board: 'In progress', deps: ['T-014'], prs: [], layer: 'frontend', next: 'Terminar login, cookie, middleware e logout. Ainda sem branch ou PR no repositório.' },

  // ---- Backlog (distribuição V3) ----
  { id: 'T-016', issue: 28, title: 'Gate de 80% de cobertura dos contratos na CI', short: 'Gate de cobertura', owner: 'Kaique', gh: ['Kaique'], board: 'Backlog', deps: [], prs: [], layer: 'contratos', score: 12, days: [0.5, 1], next: 'Script check-coverage.sh, remover o Counter e ligar o passo na CI.' },
  { id: 'T-017', issue: 29, title: 'ABI e bytecode do contrato em packages/shared', short: 'ABI e bytecode', owner: 'Alison', gh: ['Alison'], board: 'Backlog', deps: [], prs: [], layer: 'shared', score: 38.5, days: [2, 3], decision: 'Decisão pendente sobre o pacote shared. Não bloqueia o início.', next: 'Gerador da ABI e do bytecode, com --check na CI.' },
  { id: 'T-018', issue: 30, title: 'Script de deploy e bootstrap de papéis', short: 'Deploy e papéis', owner: 'Gabriel', gh: ['Gabriel'], board: 'Backlog', deps: [], prs: [], layer: 'contratos', score: 29, days: [1, 2], next: 'Deploy.s.sol e Deploy.t.sol.' },
  { id: 'T-019', issue: 31, title: 'Script de onboarding de ICT e concessão de ICT_ROLE', short: 'Onboarding de ICT', owner: 'Gabriel', gh: ['Gabriel'], board: 'Backlog', deps: ['T-018'], prs: [], layer: 'contratos', score: 45.5, days: [2, 3], next: 'Geração da conta da ICT e scripts de concessão e revogação de ICT_ROLE.' },
  { id: 'T-020', issue: 32, title: 'Módulo de leitura pública da chain na API', short: 'Leitura da chain', owner: 'Alison', gh: ['Alison'], board: 'Backlog', deps: ['T-017'], prs: [], layer: 'backend', score: 52, days: [2, 3], decision: 'Decisão pendente sobre o pacote shared pode mudar um critério.', next: 'ChainReadModule com publicClient do viem.' },
  { id: 'T-021', issue: 33, title: 'Módulo de signers operacionais', short: 'Signers', owner: 'Lukas', gh: ['Lukas'], board: 'Backlog', deps: ['T-012', 'T-017', 'T-020'], prs: [], layer: 'backend', score: 76.5, days: [3, 4], next: 'Carga e validação das chaves operacionais e escrita controlada.' },
  { id: 'T-022', issue: 34, title: 'Cadastro de ICT off-chain e geração do ictRef', short: 'Cadastro de ICT', owner: 'Alison', gh: ['Alison'], board: 'Backlog', deps: ['T-012', 'T-013'], prs: [], layer: 'backend', score: 60, days: [3, 4], next: 'POST /icts, guard por papel e transação única.' },
  { id: 'T-023', issue: 35, title: 'Registro on-chain da ICT pelo backend', short: 'Registro on-chain', owner: 'Lukas', gh: ['Lukas'], board: 'Backlog', deps: ['T-019', 'T-020', 'T-021', 'T-022'], prs: [], layer: 'integracao', score: 89, days: [4, 5], decision: 'Decisão pendente sobre quem dispara o registro. Não bloqueia o início.', next: 'registerICT assinado, recibo conferido e banco atualizado.' },
  { id: 'T-024', issue: 36, title: 'Leitor de eventos do contrato com checkpoint', short: 'Leitor de eventos', owner: 'Gabriel', gh: ['Gabriel'], board: 'Backlog', deps: ['T-017', 'T-020'], prs: [], layer: 'persistencia', score: 61.5, days: [3, 4], next: 'Worker com checkpoint e janelas de blocos.' },
  { id: 'T-025', issue: 37, title: 'Projeção do evento ICTRegistered', short: 'Projeção de evento', owner: 'Lukas', gh: ['Lukas'], board: 'Backlog', deps: ['T-024', 'T-013'], prs: [], layer: 'persistencia', score: 59.5, days: [2, 3], next: 'Handler de ICTRegistered. Função e migration compartilhadas com a T-023.' },
  { id: 'T-026', issue: 38, title: 'Upload dos documentos e hash do conjunto documental', short: 'Upload e hash', owner: 'Lukas', gh: ['Lukas'], board: 'Backlog', deps: ['T-012', 'T-013'], prs: [], layer: 'persistencia', score: 58, days: [3, 4], blockedByDecision: 'Decisão pendente: algoritmo de hash e manifesto. Bloqueia o início.', next: 'Upload, hash por arquivo e hash do conjunto.' },
  { id: 'T-027', issue: 39, title: 'Tela de cadastro de ICT', short: 'Tela de cadastro', owner: 'Kaique', gh: ['Kaique'], board: 'Backlog', deps: ['T-015', 'T-022', 'T-023'], prs: [], layer: 'frontend', score: 48.5, days: [3, 4], decision: 'Decisão pendente sobre quem dispara o registro. Não bloqueia o início.', next: 'Telas com fetch simulado; integração real depois de T-022 e T-023.' },
]

export const PEOPLE: Person[] = ['Lukas', 'Gabriel', 'Alison', 'Kaique']
export const COLOR: Record<Person, string> = {
  Lukas: '#7dd3fc',
  Gabriel: '#86efac',
  Alison: '#f0abfc',
  Kaique: '#fcd34d',
}
export const ROLE: Record<Person, string> = {
  Lukas: 'Arquitetura, API e segurança',
  Gabriel: 'Contratos',
  Alison: 'Base da API e custódia',
  Kaique: 'Frontend',
}

export const byId = (id: string) => TASKS.find((t) => t.id === id)!
export const BACKLOG = TASKS.filter((t) => t.score !== undefined)
export const DONE = TASKS.filter((t) => t.board === 'Done')
export const REVIEW = TASKS.filter((t) => t.board === 'In review')
export const PROGRESS = TASKS.filter((t) => t.board === 'In progress')
export const TOTAL = TASKS.length

export const mid = (t: Task) => (t.days ? (t.days[0] + t.days[1]) / 2 : 0)
export const fmt = (n: number) => String(n).replace('.', ',')

export const levelOf = (score: number): Level => (score >= 75 ? 'critica' : score >= 50 ? 'alta' : score >= 25 ? 'media' : 'baixa')
export const LEVEL: Record<Level, string> = { baixa: 'Baixa', media: 'Moderada', alta: 'Alta', critica: 'Crítica' }

export type State = 'done' | 'review' | 'progress' | 'ready' | 'blocked'
export const STATE_LABEL: Record<State, string> = {
  done: 'Concluída',
  review: 'Aguardando revisão',
  progress: 'Em desenvolvimento',
  ready: 'Pronta para começar',
  blocked: 'Aguardando dependência',
}

/** Estado derivado: no Backlog, pronta só se todas as dependências estão concluídas e não há decisão bloqueante. */
export function stateOf(t: Task): State {
  if (t.board === 'Done') return 'done'
  if (t.board === 'In review') return 'review'
  if (t.board === 'In progress') return 'progress'
  const open = t.deps.filter((d) => byId(d).board !== 'Done')
  return open.length === 0 && !t.blockedByDecision ? 'ready' : 'blocked'
}

/** Dependências abertas de uma task. */
export const openDeps = (t: Task) => t.deps.filter((d) => byId(d).board !== 'Done')

/** Fase de execução: 0 = sem dependência aberta no grafo completo. */
const levelCache: Record<string, number> = {}
export function phaseOf(id: string): number {
  if (levelCache[id] !== undefined) return levelCache[id]
  const t = byId(id)
  const l = t.deps.length ? Math.max(...t.deps.map(phaseOf)) + 1 : 0
  return (levelCache[id] = l)
}

export const EDGES = TASKS.flatMap((t) => t.deps.map((d) => ({ from: d, to: t.id })))

/** Caminho crítico: sequência de maior esforço entre as tasks do Backlog. */
export const CRITICAL = ['T-017', 'T-020', 'T-021', 'T-023', 'T-027']
export const CRITICAL_DAYS = CRITICAL.reduce((s, id) => s + mid(byId(id)), 0)
export const isCriticalEdge = (a: string, b: string) => {
  const i = CRITICAL.indexOf(a)
  return i >= 0 && CRITICAL[i + 1] === b
}

export const ancestors = (id: string, acc = new Set<string>()): Set<string> => {
  byId(id).deps.forEach((d) => {
    if (!acc.has(d)) {
      acc.add(d)
      ancestors(d, acc)
    }
  })
  return acc
}
export const descendants = (id: string): Set<string> => {
  const out = new Set<string>()
  const q = [id]
  while (q.length) {
    const x = q.pop()!
    EDGES.filter((e) => e.from === x).forEach((e) => {
      if (!out.has(e.to)) {
        out.add(e.to)
        q.push(e.to)
      }
    })
  }
  return out
}

export const FRONTS: { id: Front; name: string; line: string }[] = [
  { id: 'arquitetura', name: 'Arquitetura e segurança', line: 'Decisões escritas antes do código' },
  { id: 'contratos', name: 'Smart contracts', line: 'O contrato do MVP, completo' },
  { id: 'backend', name: 'Backend e persistência', line: 'Ambiente, Prisma e usuários' },
  { id: 'frontend', name: 'Frontend', line: 'Landing e casca da área interna' },
]

export const LAYERS: { id: Layer; name: string }[] = [
  { id: 'contratos', name: 'Smart contracts' },
  { id: 'shared', name: 'Shared / ABI' },
  { id: 'backend', name: 'Backend' },
  { id: 'persistencia', name: 'Persistência' },
  { id: 'integracao', name: 'Integração' },
  { id: 'frontend', name: 'Frontend' },
]

export const LOAD = PEOPLE.map((p) => {
  const mine = BACKLOG.filter((t) => t.owner === p)
  return {
    person: p,
    tasks: mine,
    days: mine.reduce((s, t) => s + mid(t), 0),
    score: mine.reduce((s, t) => s + (t.score ?? 0), 0),
  }
})
export const TOTAL_DAYS = LOAD.reduce((s, l) => s + l.days, 0)
export const TOTAL_SCORE = LOAD.reduce((s, l) => s + l.score, 0)

/** Pendências de decisão e revisão que aparecem no caminho crítico. */
export const CHECKPOINTS = [
  { id: 'rev-43', at: 'T-012', kind: 'Revisão', text: 'PR #43 · revisão e aprovação pela mentoria (Heitor)' },
  { id: 'rev-44', at: 'T-013', kind: 'Revisão', text: 'PR #44 · revisão e aprovação pela mentoria (Heitor)' },
  { id: 'dec-shared', at: 'T-017', kind: 'Decisão', text: 'Modelo do pacote shared: carregar na API compilada?' },
  { id: 'dec-hash', at: 'T-026', kind: 'Decisão', text: 'Algoritmo de hash e manifesto dos documentos' },
]
