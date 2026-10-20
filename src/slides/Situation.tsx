import { Reveal, Eyebrow, Title } from './ui'

const ITEMS = [
  { n: 12, label: 'concluídas', note: 'T-001 a T-011 e T-014', color: 'var(--color-gabriel)' },
  { n: 2, label: 'em revisão', note: 'T-012 e T-013, com CI verde', color: '#e6b656' },
  { n: 1, label: 'em desenvolvimento', note: 'T-015', color: 'var(--color-accent)' },
  { n: 12, label: 'no Backlog', note: 'T-016 a T-027', color: 'var(--color-mute)' },
]

export default function Situation() {
  return (
    <div className="w-full max-w-5xl">
      <Reveal>
        <Eyebrow>Onde estamos</Eyebrow>
        <Title>Doze entregas prontas, doze pela frente.</Title>
      </Reveal>
      <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
        {ITEMS.map((it, i) => (
          <Reveal key={it.label} delay={0.1 + i * 0.08}>
            <div className="text-7xl font-extrabold tabular-nums" style={{ color: it.color }}>
              {it.n}
            </div>
            <div className="mt-2 text-lg font-semibold">{it.label}</div>
            <div className="mt-1 text-sm text-mute">{it.note}</div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
