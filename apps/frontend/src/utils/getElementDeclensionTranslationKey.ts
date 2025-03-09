export function getElementDeclensionTranslationKey(count: number) {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "details.multipleElements"
  }

  switch (lastDigit) {
    case 1:
      return "details.singleElements"
    case 2:
    case 3:
    case 4:
      return "details.manyElements"
    default:
      return "details.multipleElements"
  }
}
