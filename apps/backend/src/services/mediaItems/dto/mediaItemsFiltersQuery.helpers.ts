export const releaseStatusOptions = [
  "rumored",
  "canceled",
  "planned",
  "pilot",
  "in production",
  "returning series",
  "post production",
  "released",
  "ended",
] as const

export function parseStringArrayQuery(value: unknown): string[] | undefined {
  if (!value) {
    return undefined
  }

  return Array.isArray(value)
    ? value.filter(Boolean)
    : String(value)
        .split(",")
        .map(v => v.trim())
}

export function parseNumberArrayQuery(value: unknown): (number | undefined)[] | undefined {
  if (value === undefined) {
    return undefined
  }

  return String(value)
    .split(",")
    .map(v =>
      v === ""
        ? undefined
        : Number(v),
    )
}
