import { SNAPSHOT } from '../data'

export default function Open() {
  return (
    <>
      <div className="hero__scrim" aria-hidden="true" />
      <div className="container container--wide">
        <p className="eyebrow rise" style={{ '--i': 1 } as React.CSSProperties}>Residência Web3 · Credenciamento de ICTs</p>
        <h1 className="hero__headline rise" style={{ '--i': 2 } as React.CSSProperties}>
          O próximo ciclo do ICT.
        </h1>
        <p className="hero__sub rise" style={{ '--i': 4 } as React.CSSProperties}>
          12 tarefas. 4 desenvolvedores. Uma estratégia de execução.
        </p>
        <p className="note rise" style={{ '--i': 5 } as React.CSSProperties}>Snapshot de {SNAPSHOT}</p>
        <p className="indicator rise" style={{ '--i': 6 } as React.CSSProperties} aria-hidden="true">
          <i>↓</i>
          <span>Explorar</span>
        </p>
      </div>
    </>
  )
}
