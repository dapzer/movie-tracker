export function getMatchesDeclensionTranslationKey(count: number) {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "search.multipleMatches"
  }

  switch (lastDigit) {
    case 1:
      return "search.singleMatch"
    case 2:
    case 3:
    case 4:
      return "search.manyMatches"
    default:
      return "search.multipleMatches"
  }
}
