import { useEffect, useRef } from 'react'

export type Scene = 'network' | 'ambient' | 'chains' | 'flow' | 'closing'

interface P { x: number; y: number; vx: number; vy: number; r: number; ph: number; px: number; py: number }

const CYAN = '125,211,252'
const rand = (a: number, b: number) => a + Math.random() * (b - a)

/**
 * Fundo animado: um único canvas fixo, com uma cena por seção.
 * Rede de partículas com conexões dinâmicas na abertura (como no slide original),
 * cenas mais discretas nas demais. Respeita prefers-reduced-motion e pausa fora de foco.
 */
export default function FX({ scene }: { scene: Scene }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<Scene>(scene)
  sceneRef.current = scene

  useEffect(() => {
    const canvas = ref.current!
    const g = canvas.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let last = performance.now()
    let parts: P[] = []
    let built: Scene | null = null
    let alpha = 0
    let t = 0
    const pointer = { x: -9999, y: -9999 }

    const build = (s: Scene) => {
      const narrow = w < 720
      const n = s === 'network' ? (narrow ? 80 : 230) : s === 'closing' ? (narrow ? 50 : 90) : narrow ? 34 : 64
      parts = []
      for (let i = 0; i < n; i++) {
        let x = rand(0, w)
        let y = rand(0, h)
        if (s === 'network') x = rand(w * (narrow ? 0.05 : 0.36), w * 1.02)
        if (s === 'closing') {
          const a = rand(0, Math.PI * 2)
          const rr = rand(0.16, 0.5) * Math.min(w, h) * (1 + Math.random() * 0.5)
          x = w / 2 + Math.cos(a) * rr * 1.5
          y = h / 2 + Math.sin(a) * rr
        }
        parts.push({ x, y, vx: rand(-0.1, 0.1), vy: rand(-0.1, 0.1), r: rand(1.1, 2.5), ph: rand(0, 6.28), px: 0, py: 0 })
      }
      built = s
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      built = null
    }

    const dot = (x: number, y: number, r: number, a: number) => {
      g.fillStyle = `rgba(191,227,245,${a})`
      g.beginPath()
      g.arc(x, y, r, 0, 6.2832)
      g.fill()
    }
    const seg = (x1: number, y1: number, x2: number, y2: number, a: number, lw = 1) => {
      g.strokeStyle = `rgba(${CYAN},${a})`
      g.lineWidth = lw
      g.beginPath()
      g.moveTo(x1, y1)
      g.lineTo(x2, y2)
      g.stroke()
    }

    const particles = (s: Scene, dt: number) => {
      const linkD = s === 'network' ? (w < 720 ? 100 : 150) : s === 'closing' ? 130 : 120
      const lineA = s === 'network' ? 0.62 : 0.26
      const dotA = s === 'network' ? 1 : 0.65
      const push = s === 'network' && !coarse && !reduce
      for (const p of parts) {
        if (!reduce) {
          p.ph += dt * 0.5
          p.x += (p.vx + Math.sin(p.ph) * 0.05) * dt * 60
          p.y += (p.vy + Math.cos(p.ph * 0.9) * 0.05) * dt * 60
          if (p.x < -20) p.x = w + 20
          if (p.x > w + 20) p.x = -20
          if (p.y < -20) p.y = h + 20
          if (p.y > h + 20) p.y = -20
        }
        let tx = 0
        let ty = 0
        if (push) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < 150 * 150 && d2 > 1) {
            const d = Math.sqrt(d2)
            const f = (1 - d / 150) * 26
            tx = (dx / d) * f
            ty = (dy / d) * f
          }
        }
        p.px += (tx - p.px) * 0.08
        p.py += (ty - p.py) * 0.08
      }
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i]
        const ax = a.x + a.px
        const ay = a.y + a.py
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j]
          const dx = ax - (b.x + b.px)
          const dy = ay - (b.y + b.py)
          const d2 = dx * dx + dy * dy
          if (d2 < linkD * linkD) {
            const k = 1 - Math.sqrt(d2) / linkD
            seg(ax, ay, b.x + b.px, b.y + b.py, k * lineA)
          }
        }
        if (i % 9 === 0) {
          g.fillStyle = `rgba(${CYAN},0.10)`
          g.beginPath()
          g.arc(ax, ay, 9 + Math.sin(a.ph * 1.5) * 2, 0, 6.2832)
          g.fill()
        }
        dot(ax, ay, a.r, dotA * (0.7 + 0.3 * Math.sin(a.ph * 2)))
      }
    }

    const chains = () => {
      for (let c = 0; c < 3; c++) {
        const y = h * (0.22 + c * 0.28)
        const step = Math.max(70, w / 14)
        const off = ((c * 37) % step) - step
        for (let x = off; x < w + step; x += step) {
          seg(x, y, x + step, y, 0.06)
          dot(x, y, 1.8, 0.2)
        }
        const px = ((t * (40 + c * 14) + c * 300) % (w + 200)) - 100
        const grd = g.createLinearGradient(px - 90, 0, px + 10, 0)
        grd.addColorStop(0, `rgba(${CYAN},0)`)
        grd.addColorStop(1, `rgba(${CYAN},0.3)`)
        g.strokeStyle = grd
        g.lineWidth = 1.6
        g.beginPath()
        g.moveTo(px - 90, y)
        g.lineTo(px + 10, y)
        g.stroke()
        dot(px + 10, y, 2.4, 0.6)
      }
    }

    const flow = () => {
      for (let k = 0; k < 6; k++) {
        const base = h * (0.16 + k * 0.14)
        const amp = 14 + k * 5
        g.strokeStyle = `rgba(${CYAN},0.09)`
        g.lineWidth = 1
        g.beginPath()
        for (let x = 0; x <= w; x += 16) {
          const y = base + Math.sin(x * 0.004 + k + t * 0.25) * amp
          x === 0 ? g.moveTo(x, y) : g.lineTo(x, y)
        }
        g.stroke()
        const px = ((t * (30 + k * 9) + k * 220) % (w + 100)) - 50
        dot(px, base + Math.sin(px * 0.004 + k + t * 0.25) * amp, 2.2, 0.7)
      }
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      t += dt
      const s = sceneRef.current
      if (built !== s) {
        // sai a cena anterior antes de montar a nova
        alpha = Math.max(0, alpha - dt * 3.2)
        if (alpha <= 0.01) build(s)
      } else {
        alpha = Math.min(1, alpha + dt * 1.6)
      }
      g.clearRect(0, 0, w, h)
      if (built && alpha > 0) {
        g.globalAlpha = alpha
        if (built === 'chains') chains()
        else if (built === 'flow') flow()
        else particles(built, dt)
        g.globalAlpha = 1
      }
      raf = requestAnimationFrame(frame)
    }

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
    }
    const onLeave = () => {
      pointer.x = pointer.y = -9999
    }
    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.addEventListener('visibilitychange', onVis)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} className="fx" aria-hidden="true" />
}
