export function getReviewDeclensionTranslationKey(count: number) {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "ui.reviews.multiple"
  }

  switch (lastDigit) {
    case 1:
      return "ui.reviews.single"
    case 2:
    case 3:
    case 4:
      return "ui.reviews.many"
    default:
      return "ui.reviews.multiple"
  }
}
