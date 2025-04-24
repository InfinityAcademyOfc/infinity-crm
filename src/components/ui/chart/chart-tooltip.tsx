
import * as React from "react"
import { useChart } from "./chart-context"
import { ChartTooltipProps } from "./types"
import { cn } from "@/lib/utils"

export function ChartTooltip({
  className,
  children,
  ...props
}: ChartTooltipProps) {
  const chart = useChart()
  
  React.useEffect(() => {
    if (typeof document === "undefined") return
    
    // This would typically be the recharts tooltip element
    const tooltipEl = document.querySelector(".recharts-tooltip-wrapper")
    
    if (tooltipEl && tooltipEl instanceof HTMLElement) {
      tooltipEl.classList.add("!bg-background", "!text-foreground", "!shadow-md", "!border", "!border-border")
    }
  }, [])

  return (
    <div
      className={cn("z-50", className)}
      data-chart-tooltip=""
      data-chart={chart.id}
      {...props}
    >
      {children}
    </div>
  )
}

export function ChartTooltipContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-3 py-2 rounded-lg border border-border bg-background shadow",
        className
      )}
      {...props}
    />
  )
}
