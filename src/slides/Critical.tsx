import { CRITICAL, CRITICAL_DAYS, COLOR, byId, mid, fmt } from '../data'
import { Reveal, Eyebrow, Title, Code } from './ui'

export default function Critical() {
  return (
    <div className="w-full max-w-6xl">
      <Reveal>
        <Eyebrow>Caminho crítico</Eyebrow>
        <Title>
          {fmt(CRITICAL_DAYS)} dias, <span className="text-mute">em cinco passos.</span>
        </Title>
      </Reveal>
      <ol className="mt-14 grid gap-6 md:grid-cols-5">
        {CRITICAL.map((id, i) => {
          const t = byId(id)
          return (
            <Reveal key={id} delay={0.1 + i * 0.1}>
              <li className="relative border-t-2 pt-4" style={{ borderColor: COLOR[t.owner] }}>
                <Code>{t.id}</Code>
                <div className="mt-1 text-lg font-bold leading-tight">{t.short}</div>
                <div className="mt-3 text-sm font-semibold" style={{ color: COLOR[t.owner] }}>
                  {t.owner}
                </div>
                <div className="text-sm text-mute">{fmt(mid(t))} dias</div>
              </li>
            </Reveal>
          )
        })}
      </ol>
      <Reveal delay={0.7}>
        <p className="mt-12 max-w-2xl text-lg leading-relaxed text-mute">
          Os dois primeiros passos são da Alison. Se a T-017 ou a T-020 atrasar, a T-021 e a T-023 esperam.
        </p>
      </Reveal>
    </div>
  )
}
