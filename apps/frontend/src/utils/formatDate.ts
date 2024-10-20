import { checkIsValidDate } from "~/utils/checkIsValidDate"

export const formatDate = (date: Date | string | undefined, locale: string) => {
  const formated = new Date(date || "").toLocaleDateString(locale, {
      month: "short", day: "numeric", year: "numeric"
    });

  return checkIsValidDate(formated) ? formated : "";
}
