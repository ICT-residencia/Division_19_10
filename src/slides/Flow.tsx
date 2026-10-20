import { motion } from 'motion/react'
import { TASKS, COLOR, CRITICAL, byId } from '../data'
import { Reveal, Eyebrow, Title } from './ui'

const W = 150
const H = 46
const GX = 220
const GY = 64

/** coluna e linha de cada cartão (a coluna é a fase de execução) */
const POS: Record<string, [number, number]> = {
  'T-012': [0, 0],
  'T-013': [0, 1],
  'T-015': [0, 2],
  'T-016': [0, 3],
  'T-017': [0, 4],
  'T-018': [0, 5],
  'T-022': [1, 0.5],
  'T-026': [1, 1.5],
  'T-020': [1, 3.5],
  'T-019': [1, 5],
  'T-021': [2, 2.5],
  'T-024': [2, 4],
  'T-023': [3, 3],
  'T-025': [3, 4.5],
  'T-027': [4, 2],
}

const nodes = TASKS.filter((t) => POS[t.id])
const edges = nodes.flatMap((t) => t.deps.filter((d) => POS[d]).map((d) => ({ from: d, to: t.id })))
const isCritical = (a: string, b: string) => {
  const i = CRITICAL.indexOf(a)
  return i >= 0 && CRITICAL[i + 1] === b
}
const px = (id: string) => POS[id][0] * GX
const py = (id: string) => POS[id][1] * GY

const PHASES = ['Agora', 'Fundação', 'Núcleo on-chain', 'Integração', 'Tela']

export default function Flow() {
  const width = 4 * GX + W
  const height = 5 * GY + H
  return (
    <div className="w-full max-w-6xl">
      <Reveal>
        <Eyebrow>Fluxo</Eyebrow>
        <Title>Cada seta é uma dependência declarada na issue.</Title>
      </Reveal>
      <Reveal delay={0.1} className="mt-10 overflow-x-auto">
        <div className="min-w-[780px]">
          <div className="mb-3 grid grid-cols-5 text-xs font-semibold uppercase tracking-widest text-mute">
            {PHASES.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
          <svg viewBox={`-2 -2 ${width + 4} ${height + 4}`} role="img" aria-label="Diagrama de dependências entre as tarefas" className="w-full">
            {edges.map((e) => {
              const x1 = px(e.from) + W
              const y1 = py(e.from) + H / 2
              const x2 = px(e.to)
              const y2 = py(e.to) + H / 2
              const dx = (x2 - x1) / 2
              const crit = isCritical(e.from, e.to)
              return (
                <motion.path
                  key={`${e.from}-${e.to}`}
                  d={`M${x1} ${y1} C${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke={crit ? 'var(--color-accent)' : '#3f5578'}
                  strokeWidth={crit ? 2.6 : 1.4}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                />
              )
            })}
            {nodes.map((t) => {
              const busy = t.board === 'In review' || t.board === 'In progress'
              return (
                <g key={t.id} transform={`translate(${px(t.id)} ${py(t.id)})`}>
                  <rect width={W} height={H} rx={10} fill="var(--color-panel)" stroke={COLOR[t.owner]} strokeWidth={1.4} />
                  <text x={12} y={19} fontFamily="var(--font-mono)" fontSize={11} fill="var(--color-mute)">
                    {t.id}
                  </text>
                  <text x={12} y={36} fontSize={12.5} fontWeight={600} fill="var(--color-ink)">
                    {t.short}
                  </text>
                  {busy && <circle cx={W - 12} cy={13} r={4.5} fill={t.board === 'In review' ? '#e6b656' : 'var(--color-accent)'} />}
                </g>
              )
            })}
          </svg>
        </div>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2 text-xs text-mute">
          {(['Lukas', 'Gabriel', 'Alison', 'Kaique'] as const).map((p) => (
            <span key={p} className="inline-flex items-center gap-2">
              <i className="h-2.5 w-2.5 rounded-sm" style={{ background: COLOR[p] }} />
              {p}
            </span>
          ))}
          <span className="inline-flex items-center gap-2">
            <i className="h-2 w-2 rounded-full" style={{ background: '#e6b656' }} /> em revisão
          </span>
          <span className="inline-flex items-center gap-2">
            <i className="h-2 w-2 rounded-full bg-accent" /> em desenvolvimento
          </span>
          <span className="inline-flex items-center gap-2">
            <i className="h-0.5 w-5 bg-accent" /> caminho crítico
          </span>
          <span>{byId('T-016').short} não depende de ninguém.</span>
        </div>
      </Reveal>
    </div>
  )
}
