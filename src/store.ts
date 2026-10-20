import { useSyncExternalStore } from 'react'
import { CHECKLISTS, defaultChecked, itemsOf } from './data/checklists'
import { SNAPSHOT, TASKS } from './data'

/**
 * Persistência local das marcações de checklist e das notas.
 * Só localStorage (não há backend): nada aqui é enviado ao GitHub.
 * Chave versionada: ict-workspace:v1. Guardamos apenas o que difere do padrão.
 */
const KEY = 'ict-workspace:v1'
const VERSION = 1

interface Saved {
  version: number
  updatedAt: string
  /** tarefa → item → marcado (somente sobrescritas do padrão) */
  checks: Record<string, Record<string, boolean>>
  notes: Record<string, string>
}

const empty = (): Saved => ({ version: VERSION, updatedAt: '', checks: {}, notes: {} })

let state: Saved = load()
const listeners = new Set<() => void>()
let memoryOnly = false

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const j = JSON.parse(raw)
    if (j && j.version === VERSION && typeof j.checks === 'object' && typeof j.notes === 'object') return j as Saved
  } catch {
    /* localStorage indisponível ou conteúdo inválido: começa vazio */
  }
  return empty()
}

function persist() {
  state = { ...state, updatedAt: new Date().toISOString() }
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    memoryOnly = true
  }
  listeners.forEach((l) => l())
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = load()
      cb()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', onStorage)
  }
}

export const useSaved = () => useSyncExternalStore(subscribe, () => state)
export const isMemoryOnly = () => memoryOnly

export function isChecked(s: Saved, task: string, item: string, fallback: boolean): boolean {
  const v = s.checks[task]?.[item]
  return v === undefined ? fallback : v
}

export function setChecked(task: string, item: string, value: boolean, fallback: boolean) {
  const checks = { ...state.checks }
  const t = { ...(checks[task] ?? {}) }
  if (value === fallback) delete t[item]
  else t[item] = value
  if (Object.keys(t).length) checks[task] = t
  else delete checks[task]
  state = { ...state, checks }
  persist()
}

export function setNote(task: string, text: string) {
  const notes = { ...state.notes }
  if (text.trim()) notes[task] = text
  else delete notes[task]
  state = { ...state, notes }
  persist()
}

export interface Progress {
  done: number
  total: number
  pct: number
}

export function progressOf(s: Saved, task: string): Progress {
  const items = itemsOf(task)
  const done = items.filter((it) => isChecked(s, task, it.id, defaultChecked(it))).length
  return { done, total: items.length, pct: items.length ? Math.round((done / items.length) * 100) : 0 }
}

/** primeira atividade ainda não marcada, na ordem do checklist */
export function nextPending(s: Saved, task: string) {
  for (const g of CHECKLISTS[task]) {
    for (const it of g.items) {
      if (!isChecked(s, task, it.id, defaultChecked(it))) return { item: it, group: g.title }
    }
  }
  return null
}

/* ---------- exportação e importação ---------- */

export function buildExport(s: Saved) {
  return {
    app: 'ict-workspace',
    version: VERSION,
    exportedAt: new Date().toISOString(),
    snapshot: SNAPSHOT,
    aviso: 'Marcações locais do planejamento. Não representam o status oficial no GitHub.',
    checks: s.checks,
    notes: s.notes,
    resumo: Object.fromEntries(TASKS.map((t) => [t.id, progressOf(s, t.id)])),
  }
}

export function downloadExport() {
  const blob = new Blob([JSON.stringify(buildExport(state), null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `ict-checklists-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export interface ImportResult {
  ok: boolean
  message: string
}

/** Valida e substitui as marcações locais pelo conteúdo do arquivo. */
export function importFromText(text: string): ImportResult {
  let j: unknown
  try {
    j = JSON.parse(text)
  } catch {
    return { ok: false, message: 'O arquivo não é um JSON válido.' }
  }
  const o = j as { app?: string; version?: number; checks?: unknown; notes?: unknown }
  if (!o || o.app !== 'ict-workspace') return { ok: false, message: 'O arquivo não é uma exportação do ICT Workspace.' }
  if (o.version !== VERSION) return { ok: false, message: `Versão ${String(o.version)} não suportada. Esperado: ${VERSION}.` }
  if (typeof o.checks !== 'object' || o.checks === null || typeof o.notes !== 'object' || o.notes === null) {
    return { ok: false, message: 'O arquivo está incompleto: faltam marcações ou notas.' }
  }
  const checks: Saved['checks'] = {}
  const notes: Saved['notes'] = {}
  let kept = 0
  let skipped = 0
  const known = new Set(TASKS.map((t) => t.id))
  for (const [task, items] of Object.entries(o.checks as Record<string, unknown>)) {
    if (!known.has(task) || typeof items !== 'object' || items === null) {
      skipped++
      continue
    }
    const valid = new Set(itemsOf(task).map((i) => i.id))
    for (const [id, v] of Object.entries(items as Record<string, unknown>)) {
      if (typeof v === 'boolean' && valid.has(id)) {
        ;(checks[task] ??= {})[id] = v
        kept++
      } else skipped++
    }
  }
  for (const [task, v] of Object.entries(o.notes as Record<string, unknown>)) {
    if (known.has(task) && typeof v === 'string' && v.length <= 5000) notes[task] = v
    else skipped++
  }
  state = { ...state, checks, notes }
  persist()
  return { ok: true, message: `Importado: ${kept} marcações e ${Object.keys(notes).length} ${Object.keys(notes).length === 1 ? 'nota' : 'notas'}.${skipped ? ` ${skipped} entradas ignoradas.` : ''}` }
}

export function clearAll() {
  state = { ...empty() }
  persist()
}
