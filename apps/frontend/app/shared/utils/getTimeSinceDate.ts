interface TimeUnit {
  unit: Intl.RelativeTimeFormatUnit
  ms: number
}

const TIME_UNITS: TimeUnit[] = [
  { unit: "year", ms: 31536000000 },
  { unit: "month", ms: 2628000000 },
  { unit: "day", ms: 86400000 },
  { unit: "hour", ms: 3600000 },
  { unit: "minute", ms: 60000 },
  { unit: "second", ms: 1000 },
]

export function getTimeSinceDate(date: Date | string, locale = "ru-RU"): string {
  const timestamp = typeof date === "string" ? new Date(date).getTime() : date.getTime()

  if (Number.isNaN(timestamp))
    return "—"

  const diff = timestamp - Date.now()
  const absDiff = Math.abs(diff)

  const unit = TIME_UNITS.find(u => absDiff >= u.ms) ?? TIME_UNITS[TIME_UNITS.length - 1]

  const value = Math.round(diff / unit!.ms)

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  return formatter.format(value, unit!.unit)
}
