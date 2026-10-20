// Transforma src/data/issues.raw.json (texto oficial das issues) em src/data/issues.json:
// critérios de aceite agrupados, objetivo, cenários de falha, evidência e frase de dependência.
// Nada é inventado: tudo vem do corpo da issue. Uso: node scripts/parse-issues.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const raw = JSON.parse(readFileSync(new URL('../src/data/issues.raw.json', import.meta.url), 'utf8'))
const hash = (s) => {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return h.toString(36)
}
const clean = (s) => s.replace(/\s+/g, ' ').trim()

const out = {}
for (const issue of Object.values(raw)) {
  const m = issue.title.match(/^(T-\d{3})/)
  if (!m) continue
  const id = m[1]
  const lines = issue.body.replace(/\r/g, '').split('\n')

  // quebra em seções por título
  const sections = []
  let cur = { title: '', lines: [] }
  let inFence = false
  for (const l of lines) {
    if (/^```/.test(l.trim())) inFence = !inFence
    const h = !inFence && l.match(/^#{2,4}\s+(.+?)\s*$/)
    if (h) {
      sections.push(cur)
      cur = { title: h[1], lines: [] }
    } else cur.lines.push(l)
  }
  sections.push(cur)

  const groups = []
  const warnings = []
  const failures = []
  let evidence = ''
  let decisions = ''
  let objective = ''
  let depends = ''

  for (const sec of sections) {
    const t = sec.title.toLowerCase()
    // itens de checklist
    const items = []
    let last = null
    let fence = false
    for (const l of sec.lines) {
      if (/^```/.test(l.trim())) fence = !fence
      if (fence) continue
      const cb = l.match(/^\s*- \[[ xX]\]\s+(.*)$/)
      if (cb) {
        last = { text: clean(cb[1]) }
        items.push(last)
      } else if (/^\s*>/.test(l)) {
        const w = clean(l.replace(/^\s*>\s*/, ''))
        if (w) warnings.push(w.replace(/\*\*/g, ''))
        last = null
      } else if (last && /^\s{2,}\S/.test(l)) {
        last.text = clean(last.text + ' ' + l)
      } else if (l.trim() === '' || /^\s*-\s/.test(l)) {
        last = null
      }
    }
    if (items.length) {
      groups.push({
        title: sec.title || 'Critérios',
        items: items.map((it) => ({ id: hash(it.text), text: it.text })),
      })
    }
    const body = sec.lines.join('\n').trim()
    if (t.startsWith('cenários de falha')) {
      for (const l of sec.lines) {
        const b = l.match(/^\s*- (?!\[)(.*)$/)
        if (b) failures.push(clean(b[1]))
      }
    }
    if (t.startsWith('evidência esperada')) evidence = clean(body.split(/\n\n/)[0])
    if (t.startsWith('pendente de decisão') || t.startsWith('decisões a tomar')) decisions = clean(body.split(/\n\n/).slice(0, 2).join(' '))
    if (t === 'objetivo') objective = clean(body.split(/\n\n/)[0])
  }

  // issues antigas: "**Objetivo:** ..." no corpo
  if (!objective) {
    const o = issue.body.match(/\*\*Objetivo:\*\*\s*([\s\S]*?)\n\n/)
    if (o) objective = clean(o[1])
  }
  const dep = issue.body.match(/\*\*(Não depende de outra task\.?|Depende d[^*]+)\*\*/)
  if (dep) depends = clean(dep[1])

  out[id] = {
    issue: issue.number,
    title: issue.title.replace(/^T-\d{3}\s*—\s*/, ''),
    state: issue.state,
    objective,
    depends,
    groups,
    warnings: [...new Set(warnings)],
    failures,
    evidence,
    decisions,
  }
}
writeFileSync(new URL('../src/data/issues.json', import.meta.url), JSON.stringify(out, null, 1))
for (const [id, v] of Object.entries(out)) {
  console.log(id, 'itens=' + v.groups.reduce((s, g) => s + g.items.length, 0), 'grupos=' + v.groups.map((g) => g.title.slice(0, 22)).join('|'), '| dep:', v.depends.slice(0, 50), '| obj:', v.objective ? 'ok' : 'FALTA', '| ev:', v.evidence ? 'ok' : '-')
}
