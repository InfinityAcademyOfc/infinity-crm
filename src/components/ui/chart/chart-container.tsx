
import * as React from "react"
import { ChartContainerProps } from "./types"
import { ChartContext } from "./chart-context"
import { ChartStyle } from "./chart-style"

export function ChartContainer({
  id: idProp,
  config = {},
  children,
}: ChartContainerProps) {
  const id = React.useMemo(() => idProp ?? Math.random().toString(36).substring(2, 9), [idProp])

  return (
    <ChartContext.Provider value={{ id, config }}>
      <div data-chart={id}>
        <ChartStyle id={id} config={config} />
        {children}
      </div>
    </ChartContext.Provider>
  )
}
