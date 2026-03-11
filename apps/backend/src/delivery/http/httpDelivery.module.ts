import { Module } from "@nestjs/common"
import { AnalyticsHttpModule } from "@/delivery/http/analytics/analytics.module"
import { AuthHttpModule } from "@/delivery/http/auth/auth.module"
import { CommunityListsHttpModule } from "@/delivery/http/communityLists/communityLists.module"
import { MediaDetailsHttpModule } from "@/delivery/http/mediaDetails/mediaDetails.module"
import { MediaItemsHttpModule } from "@/delivery/http/mediaItems/mediaItems.module"
import { MediaListsHttpModule } from "@/delivery/http/mediaLists/mediaLists.module"
import { MediaListViewsHttpModule } from "@/delivery/http/mediaListViews/mediaListViews.module"
import { MediaRatingsHttpModule } from "@/delivery/http/mediaRatings/mediaRatings.module"
import { NotificationsHttpModule } from "@/delivery/http/notifications/notifications.module"
import { OpenGraphImagesHttpModule } from "@/delivery/http/openGraphImages/openGraphImages.module"
import { ProxyHttpModule } from "@/delivery/http/proxy/proxy.module"
import { ReleaseSubscriptionsHttpModule } from "@/delivery/http/releaseSubscriptions/releaseSubscriptions.module"
import { SitemapsHttpModule } from "@/delivery/http/sitemaps/sitemaps.module"
import { TrackingDataHttpModule } from "@/delivery/http/trackingData/trackingData.module"
import { UserFollowsHttpModule } from "@/delivery/http/userFollows/userFollows.module"
import { UsersHttpModule } from "@/delivery/http/users/users.module"

@Module({
  imports: [
    AnalyticsHttpModule,
    AuthHttpModule,
    CommunityListsHttpModule,
    MediaDetailsHttpModule,
    MediaItemsHttpModule,
    MediaListsHttpModule,
    MediaListViewsHttpModule,
    MediaRatingsHttpModule,
    NotificationsHttpModule,
    OpenGraphImagesHttpModule,
    ProxyHttpModule,
    ReleaseSubscriptionsHttpModule,
    SitemapsHttpModule,
    TrackingDataHttpModule,
    UsersHttpModule,
    UserFollowsHttpModule,
  ],
})
export class HttpDeliveryModule {}
