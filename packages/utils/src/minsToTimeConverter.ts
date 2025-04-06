export function minsToTimeConverter(mins: number) {
  const days = Math.floor(mins / (60 * 24))
  const hours = Math.floor((mins % (60 * 24)) / 60)
  const minutes = mins % 60

  return {
    days,
    hours,
    minutes,
  }
}
