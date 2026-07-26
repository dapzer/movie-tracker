import { checkIsValidDate } from "~/shared/utils/checkIsValidDate"

export function formatDateWithTime(date: Date | string | undefined, locale: string) {
  const formated = new Date(date || "").toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return checkIsValidDate(formated) ? formated : ""
}
