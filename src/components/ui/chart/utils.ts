
import { ColorRecord } from "./types"

export function getColorValue(key: string): string {
  return `var(--color-${key})`
}

export function getColorRecord<K extends string>(
  colors: readonly K[]
): ColorRecord {
  return colors.reduce<ColorRecord>((acc, key) => {
    acc[key] = getColorValue(key)
    return acc
  }, {})
}
