import { PEOPLE, COLOR, BACKLOG } from '../data'
import { Reveal, Eyebrow } from './ui'

export default function Cover() {
  return (
    <div className="w-full max-w-5xl">
      <Reveal>
        <Eyebrow>Credenciamento de ICTs · MVP5</Eyebrow>
        <h1 className="text-balance text-6xl font-extrabold leading-none tracking-tight md:text-8xl">
          Divisão
          <br />
          <span className="text-mute">19/10</span>
        </h1>
      </Reveal>
      <Reveal delay={0.15} className="mt-14 flex flex-wrap items-end gap-x-10 gap-y-6">
        {PEOPLE.map((p) => (
          <div key={p}>
            <div className="text-6xl font-extrabold tabular-nums md:text-7xl" style={{ color: COLOR[p] }}>
              {BACKLOG.filter((t) => t.owner === p).length}
            </div>
            <div className="mt-1 text-sm font-semibold text-mute">{p}</div>
          </div>
        ))}
        <p className="max-w-xs pb-2 text-sm leading-relaxed text-mute">
          12 tarefas do Backlog, T-016 a T-027, cada uma com uma pessoa.
        </p>
      </Reveal>
    </div>
  )
}
