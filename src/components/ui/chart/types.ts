
import { ReactNode } from "react"

export type ColorValue = string
export type ColorRecord = Record<string, ColorValue>

export interface ThemeColors {
  light?: ColorValue
  dark?: ColorValue
  blue?: ColorValue
  green?: ColorValue
  purple?: ColorValue
}

export interface ColorItem {
  color?: ColorValue
  theme?: ThemeColors
}

export type ChartConfig = Record<string, ColorItem>

export interface ChartContextProps {
  id: string
  config: ChartConfig
}

export const THEMES = {
  light: "",
  dark: ".dark ",
  blue: ".blue ",
  green: ".green ",
  purple: ".purple "
}

export interface ChartContainerProps {
  id?: string
  config?: ChartConfig
  children: ReactNode
}

export interface ChartLegendProps {
  className?: string
  children?: ReactNode
}

export interface ChartTooltipProps {
  className?: string
  children?: ReactNode
}
