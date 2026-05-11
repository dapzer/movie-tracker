import { z } from "zod"

export const zDateTimeString = z.string().datetime({ offset: true }).pipe(z.coerce.date())

export const zBooleanQuery = z.preprocess((value) => {
  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  return value
}, z.boolean())
