import {
  RecommendationItemType,
  RecommendationSessionType,
  StoredRecommendationType,
} from "@movie-tracker/types"

export const RecommendationRepositorySymbol = Symbol("RecommendationRepository")

export interface RecommendationRepositoryInterface {
  createSession: (args: { userId: string }) => Promise<RecommendationSessionType>

  getSessionByIdAndUserId: (args: {
    sessionId: string
    userId: string
  }) => Promise<RecommendationSessionType | undefined>

  getRecommendationsBySessionId: (sessionId: string) => Promise<StoredRecommendationType[]>

  addRecommendations: (args: {
    sessionId: string
    recommendations: RecommendationItemType[]
  }) => Promise<StoredRecommendationType[]>
}
