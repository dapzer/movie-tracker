type CaseName = | "nominative"
  | "genitive"
  | "dative"
  | "accusative"
  | "instrumental"
  | "prepositional"

export function getMonthNameLocaleKey(date: Date, caseName: CaseName) {
  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ]
  const monthIndex = date.getMonth()
  const monthKey = monthNames[monthIndex]

  return `ui.months.${monthKey}.${caseName}`
}
