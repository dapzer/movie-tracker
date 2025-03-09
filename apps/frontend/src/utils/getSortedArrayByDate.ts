import type { SortOrderEnum } from "~/types/Sorting"

type FixArr<T> = T extends readonly never[] ? Omit<T, Exclude<keyof never[], number>> : T

type _DeepKeys<T> = T extends object ? (
  { [K in (string | number) & keyof T]:
    `${(
      `.${K}` | (`${K}` extends `${number}` ? `[${K}]` : never)
      )}${"" | _DeepKeys<FixArr<T[K]>>}` }[
    (string | number) & keyof T]
) : never

type DropInitDot<T> = T extends `.${infer U}` ? U : T

type DeepKeys<T> = DropInitDot<_DeepKeys<FixArr<T>>>

function getNestedValue<T>(obj: T, path: string): never {
  return path.split(".").reduce((acc: never, part: string) => {
    return acc && acc[part]
  }, obj as never)
}

export function getSortedArrayByDate<T>(array: T[], sortOrder: SortOrderEnum, sortBy: DeepKeys<T>) {
  return [...array].sort((a, b) => {
    const aDate = new Date(getNestedValue(a, sortBy))
    const bDate = new Date(getNestedValue(b, sortBy))

    if (sortOrder === "desc") {
      return bDate < aDate ? 1 : -1
    }
    else {
      return aDate < bDate ? 1 : -1
    }
  })
}
