export function arrayToString<T>(array: T[], selector?: keyof T) {
  if (!array || !Array.isArray(array) || !array?.length) {
    return ""
  }
  if (selector) {
    return array.map(el => el[selector]).join(", ")
  }

  return array.map(el => el).join(", ")
}
