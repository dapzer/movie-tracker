import { getMillisecondsFromMins } from "@movie-tracker/utils"
import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common"
import { Throttle } from "@nestjs/throttler"
import { ThrottlerBehindProxyGuard } from "@/guards/throttlerBehindProxy.guard"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { GenerateRecommendationsDto } from "@/services/recommendations/dto/generateRecommendations.dto"
import { RecommendationSessionParamsDto } from "@/services/recommendations/dto/recommendation.dto"
import { RecommendationsService } from "@/services/recommendations/recommendations.service"
import { UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import {
  CreateRecommendationsDocs,
  RecommendationsControllerDocs,
  RefreshRecommendationsDocs,
} from "./recommendations.controller.docs"

const recommendationsThrottle = {
  default: {
    limit: 5,
    ttl: getMillisecondsFromMins(15),
  },
}

@Controller("recommendations")
@RecommendationsControllerDocs()
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Post()
  @CreateRecommendationsDocs()
  @Throttle(recommendationsThrottle)
  @UseGuards(AuthGuard, ThrottlerBehindProxyGuard)
  async createRecommendations(
    @Body() body: GenerateRecommendationsDto,
    @User() user: UserDto,
  ) {
    return this.recommendationsService.create({ userId: user.id, body })
  }

  @Post(":sessionId/refresh")
  @RefreshRecommendationsDocs()
  @Throttle(recommendationsThrottle)
  @UseGuards(AuthGuard, ThrottlerBehindProxyGuard)
  async refreshRecommendations(
    @Param() params: RecommendationSessionParamsDto,
    @Body() body: GenerateRecommendationsDto,
    @User() user: UserDto,
  ) {
    return this.recommendationsService.refresh({
      sessionId: params.sessionId,
      userId: user.id,
      body,
    })
  }
}
