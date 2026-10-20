import { LOAD, TOTAL_DAYS, COLOR, fmt } from '../data'
import { Reveal, Eyebrow, Title } from './ui'

export default function Risks() {
  const lukas = LOAD.find((l) => l.person === 'Lukas')!
  const share = Math.round((lukas.days / TOTAL_DAYS) * 100)
  const max = Math.max(...LOAD.map((l) => l.days))
  return (
    <div className="w-full max-w-6xl">
      <Reveal>
        <Eyebrow>Riscos</Eyebrow>
        <Title>
          Lukas carrega {share}% do esforço. <span className="text-mute">A proposta mantém 6/2/2/2.</span>
        </Title>
      </Reveal>
      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <Reveal delay={0.1}>
          <div className="space-y-5">
            {LOAD.map((l) => (
              <div key={l.person}>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="font-semibold">{l.person}</span>
                  <span className="tabular-nums text-mute">{fmt(l.days)} dias</span>
                </div>
                <div className="h-2.5 rounded-full bg-panel">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(l.days / max) * 100}%`, background: COLOR[l.person] }}
                  />
                </div>
              </div>
            ))}
            <p className="pt-2 text-xs text-mute">Esforço estimado, sem contar a revisão das PRs #43 e #44.</p>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <ul className="space-y-6 text-lg leading-snug">
            <li>
              <b>Começar por T-022 e T-026.</b>
              <span className="block text-base text-mute">Só dependem das PRs #43 e #44, enquanto a Alison entrega T-017 e T-020.</span>
            </li>
            <li>
              <b>Revisão cruzada.</b>
              <span className="block text-base text-mute">Gabriel na T-023, Alison na T-019 e na T-021, pela ADR-002.</span>
            </li>
            <li>
              <b>Decidir o hash da T-026 cedo.</b>
              <span className="block text-base text-mute">Hash publicado não tem conserto, e a decisão bloqueia o início.</span>
            </li>
          </ul>
        </Reveal>
      </div>
    </div>
  )
}
