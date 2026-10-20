import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export const Reveal = ({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{children}</p>
)

export const Title = ({ children }: { children: ReactNode }) => (
  <h2 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">{children}</h2>
)

export const Code = ({ children, color }: { children: ReactNode; color?: string }) => (
  <span className="font-mono text-[0.85em] font-medium" style={{ color: color ?? 'var(--color-mute)' }}>
    {children}
  </span>
)
