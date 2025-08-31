export function getTmdbTotalPages(totalPages?: number) {
  if (!totalPages) {
    return 0
  }

  return Math.min(totalPages, 500)
}
