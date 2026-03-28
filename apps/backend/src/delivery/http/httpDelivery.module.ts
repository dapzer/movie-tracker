import { Module } from "@nestjs/common"
import { AnalyticsModule } from "@/delivery/http/analytics/analytics.module"
import { AuthModule } from "@/delivery/http/auth/auth.module"
import { CommunityListsModule } from "@/delivery/http/communityLists/communityLists.module"
import { MediaDetailsModule } from "@/delivery/http/mediaDetails/mediaDetails.module"
import { MediaItemsModule } from "@/delivery/http/mediaItems/mediaItems.module"
import { MediaListsModule } from "@/delivery/http/mediaLists/mediaLists.module"
import { MediaListViewsModule } from "@/delivery/http/mediaListViews/mediaListViews.module"
import { MediaRatingsModule } from "@/delivery/http/mediaRatings/mediaRatings.module"
import { MediaReviewsModule } from "@/delivery/http/mediaReviews/mediaReviews.module"
import { NotificationsModule } from "@/delivery/http/notifications/notifications.module"
import { OpenGraphImagesModule } from "@/delivery/http/openGraphImages/openGraphImages.module"
import { ProxyModule } from "@/delivery/http/proxy/proxy.module"
import { ReleaseSubscriptionsModule } from "@/delivery/http/releaseSubscriptions/releaseSubscriptions.module"
import { SitemapsModule } from "@/delivery/http/sitemaps/sitemaps.module"
import { TrackingDataModule } from "@/delivery/http/trackingData/trackingData.module"
import { UserFollowsModule } from "@/delivery/http/userFollows/userFollows.module"
import { UsersModule } from "@/delivery/http/users/users.module"

@Module({
  imports: [
    AnalyticsModule,
    AuthModule,
    CommunityListsModule,
    MediaDetailsModule,
    MediaItemsModule,
    MediaListsModule,
    MediaListViewsModule,
    MediaRatingsModule,
    MediaReviewsModule,
    NotificationsModule,
    OpenGraphImagesModule,
    ProxyModule,
    ReleaseSubscriptionsModule,
    SitemapsModule,
    TrackingDataModule,
    UsersModule,
    UserFollowsModule,
  ],
})
export class HttpDeliveryModule {}
