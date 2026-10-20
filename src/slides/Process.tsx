import { Reveal, Eyebrow, Title, Code } from './ui'

const STEPS = [
  { name: 'Issue', note: 'Critérios de aceite e dependências' },
  { name: 'Desenvolvimento', note: 'Branch da task, commits pequenos', now: ['T-015'] },
  { name: 'Pull Request', note: 'Uma task, uma PR' },
  { name: 'CI', note: 'contracts e apps verdes' },
  { name: 'Revisão', note: 'Ajustes ou aprovação', now: ['T-012', 'T-013'] },
  { name: 'Merge', note: 'Integração na main' },
  { name: 'Done', note: 'Issue fechada' },
]

export default function Process() {
  return (
    <div className="w-full max-w-6xl">
      <Reveal>
        <Eyebrow>Como o desenvolvimento avança</Eyebrow>
        <Title>Revisar não é integrar.</Title>
      </Reveal>
      <ol className="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-7">
        {STEPS.map((s, i) => (
          <Reveal key={s.name} delay={0.07 * i}>
            <li className="border-t border-line pt-4">
              <div className="text-sm font-bold text-accent">{String(i + 1).padStart(2, '0')}</div>
              <div className="mt-1 text-lg font-bold leading-tight">{s.name}</div>
              <div className="mt-1 text-sm leading-snug text-mute">{s.note}</div>
              {s.now && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.now.map((id) => (
                    <Code key={id} color="var(--color-accent)">
                      {id}
                    </Code>
                  ))}
                </div>
              )}
            </li>
          </Reveal>
        ))}
      </ol>
      <Reveal delay={0.5}>
        <p className="mt-12 max-w-2xl text-lg leading-relaxed text-mute">
          Uma PR pode ter comentários e aprovação e continuar aberta até o merge. Por isso a issue da T-012 está aberta com o cartão em revisão.
        </p>
      </Reveal>
    </div>
  )
}
