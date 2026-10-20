import type { Panel } from '../components/panels'

export interface SectionProps {
  /** a seção está em foco agora */
  visible: boolean
  open: (p: Panel) => void
  /** posição na apresentação, 1 a 7 */
  n: number
}

export const TOTAL_SECTIONS = 7
export const pad = (n: number) => String(n).padStart(2, '0')
export const idx = (n: number) => `${pad(n)} / ${pad(TOTAL_SECTIONS)}`
