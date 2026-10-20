import { motion } from 'motion/react'
import { RANKED, COLOR } from '../data'
import { Reveal, Eyebrow, Title, Code } from './ui'

export default function Ranking() {
  return (
    <div className="w-full max-w-5xl">
      <Reveal>
        <Eyebrow>Dificuldade</Eyebrow>
        <Title>As seis mais difíceis ficam com Lukas.</Title>
      </Reveal>
      <ol className="mt-10 space-y-2.5">
        {RANKED.map((t, i) => (
          <li key={t.id}>
            {i === 6 && <div className="my-4 border-t border-dashed border-line" />}
            <div className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3 md:grid-cols-[4.5rem_13rem_1fr_3.5rem]">
              <Code>{t.id}</Code>
              <span className="hidden truncate text-[15px] font-medium md:block">{t.short}</span>
              <div className="h-2.5 overflow-hidden rounded-full bg-panel">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: COLOR[t.owner], opacity: i < 6 ? 1 : 0.55 }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${t.score}%` }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="text-right text-sm font-bold tabular-nums">{(t.score ?? 0).toFixed(1).replace('.', ',')}</span>
            </div>
          </li>
        ))}
      </ol>
      <Reveal delay={0.3}>
        <p className="mt-8 text-sm text-mute">
          Pontuação de 0 a 100: arquitetura 30%, segurança 20%, dependências 20%, integração 20%, incerteza 10%. A cor é de quem fica com a tarefa.
        </p>
      </Reveal>
    </div>
  )
}
