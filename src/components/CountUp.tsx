import { useEffect, useRef, useState } from 'react'
import { animate } from 'motion/react'

/** Número que sobe até o valor quando a seção entra na viewport. */
export default function CountUp({ to, active, delay = 0 }: { to: number; active: boolean; delay?: number }) {
  const [v, setV] = useState(0)
  const done = useRef(false)
  useEffect(() => {
    if (!active || done.current) return
    done.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(to)
      return
    }
    const c = animate(0, to, { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) })
    return () => {
      c.stop()
      done.current = false
    }
  }, [active, to, delay])
  return <>{v}</>
}
