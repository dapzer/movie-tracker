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

export function parseStringArrayQuery(value: string): string[] | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined
  }

  const values = value.split(",").map(item => item.trim()).filter(Boolean)

  return values.length ? values : undefined
}

export function parseNumberArrayQuery(value: string): number[] | undefined {
  const values = parseStringArrayQuery(value)
  if (!values) {
    return undefined
  }

  const parsedValues = values.map(item => Number(item))

  return parsedValues.length ? parsedValues : undefined
}

export function parseRatingQuery(value: string): [number, number] | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined
  }

  const [minRating, maxRating] = value.split(",").map(item => item !== "" ? Number(item) : undefined)

  return [minRating, maxRating]
}

export function parseReleaseYearQuery(value: string): [number | undefined, number | undefined] | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined
  }
  const [fromYear, toYear] = value.split(",").map(item => item !== "" ? Number(item) : undefined)

  if (fromYear === undefined && toYear === undefined) {
    return undefined
  }

  return [fromYear, toYear]
}
