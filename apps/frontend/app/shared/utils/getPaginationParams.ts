import type { PaginationType } from "@movie-tracker/types"

export function getPaginationParams(args: { page?: number, itemsPerPage: number }): PaginationType {
  const page = args.page ?? 1
  const limit = args.itemsPerPage
  const offset = (page - 1) * limit

  return { offset, limit }
}
