import { PEOPLE, COLOR, ROLE, BACKLOG } from '../data'
import { Reveal, Eyebrow, Title, Code } from './ui'

export default function Owners() {
  return (
    <div className="w-full max-w-6xl">
      <Reveal>
        <Eyebrow>Quem faz o quê</Eyebrow>
        <Title>Uma tarefa, uma pessoa.</Title>
      </Reveal>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {PEOPLE.map((p, i) => {
          const mine = BACKLOG.filter((t) => t.owner === p).sort((a, b) => a.id.localeCompare(b.id))
          return (
            <Reveal key={p} delay={0.08 * i}>
              <div className="h-full border-t-2 pt-5" style={{ borderColor: COLOR[p] }}>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold">{p}</h3>
                  <span className="text-4xl font-extrabold tabular-nums" style={{ color: COLOR[p] }}>
                    {mine.length}
                  </span>
                </div>
                <p className="mt-1 text-sm text-mute">{ROLE[p]}</p>
                <ul className="mt-5 space-y-3">
                  {mine.map((t) => (
                    <li key={t.id} className="text-[15px] leading-snug">
                      <Code>{t.id}</Code> <span className="font-medium">{t.short}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )
        })}
      </div>
      <Reveal delay={0.4}>
        <p className="mt-10 text-sm text-mute">
          Aprovada por Lukas. Ainda não aplicada no GitHub, onde T-016 a T-027 seguem sem responsável.
        </p>
      </Reveal>
    </div>
  )
}
