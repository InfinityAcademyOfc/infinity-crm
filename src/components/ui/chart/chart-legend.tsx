
import * as React from "react"
import { useChart } from "./chart-context"
import { ChartLegendProps } from "./types"
import { cn } from "@/lib/utils"

export function ChartLegend({
  className,
  children,
  ...props
}: ChartLegendProps) {
  const chart = useChart()

  React.useEffect(() => {
    if (typeof document === "undefined") return
    
    // This would typically be the recharts legend element
    const legendEl = document.querySelector(".recharts-legend-wrapper")
    
    if (legendEl && legendEl instanceof HTMLElement) {
      legendEl.classList.add("!text-foreground")
    }
  }, [])

  return (
    <div
      className={cn("mt-3", className)}
      data-chart-legend=""
      data-chart={chart.id}
      {...props}
    >
      {children}
    </div>
  )
}

export function ChartLegendContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-wrap gap-4", className)} {...props} />
}
