// Leitura somente de issues do GitHub (nada é escrito lá). Gera src/data/issues.raw.json.
// Uso: node scripts/fetch-issues.mjs
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const REPO = 'residenciaweb3/credenciamento-de-icts-mvp5'
const NUMBERS = [1, 2, 3, 4, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]

const out = {}
for (const n of NUMBERS) {
  const raw = execFileSync('gh', ['issue', 'view', String(n), '--repo', REPO, '--json', 'number,title,state,body,closedAt,assignees,url'], { encoding: 'utf8' })
  const j = JSON.parse(raw)
  out[n] = { number: j.number, title: j.title, state: j.state, closedAt: j.closedAt, assignees: j.assignees.map((a) => a.login), url: j.url, body: j.body }
}
writeFileSync(new URL('../src/data/issues.raw.json', import.meta.url), JSON.stringify(out, null, 1))
console.log('issues lidas:', Object.keys(out).length)
