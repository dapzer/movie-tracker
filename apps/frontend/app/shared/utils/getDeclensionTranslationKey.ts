export function getDeclensionTranslationKey(count: number) {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `multiple`
  }

  switch (lastDigit) {
    case 1:
      return `single`
    case 2:
    case 3:
    case 4:
      return `many`
    default:
      return `multiple`
  }
}
