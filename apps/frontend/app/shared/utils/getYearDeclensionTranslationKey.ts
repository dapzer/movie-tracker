export function getYearDeclensionTranslationKey(age: number) {
  const lastDigit = age % 10
  const lastTwoDigits = age % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "years"
  }

  switch (lastDigit) {
    case 1:
      return "year"
    case 2:
    case 3:
    case 4:
      return "manyYears"
    default:
      return "years"
  }
}
