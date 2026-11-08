export function normalizeRecommendationTitle(title: string): string {
  return title.trim().replace(/\s+/g, " ").toLowerCase()
}
