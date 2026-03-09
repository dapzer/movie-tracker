import { Module } from "@nestjs/common"
import { AnalyticsHttpModule } from "@/delivery/http/analytics/analytics.module"
import { AuthHttpModule } from "@/delivery/http/auth/auth.module"
import { CommunityListsHttpModule } from "@/delivery/http/communityLists/communityLists.module"
import { MediaDetailsHttpModule } from "@/delivery/http/mediaDetails/mediaDetails.module"
import { MediaItemHttpModule } from "@/delivery/http/mediaItem/mediaItem.module"
import { MediaListHttpModule } from "@/delivery/http/mediaList/mediaList.module"
import { MediaListViewHttpModule } from "@/delivery/http/mediaListView/mediaListView.module"
import { MediaRatingHttpModule } from "@/delivery/http/mediaRating/mediaRating.module"
import { NotificationHttpModule } from "@/delivery/http/notification/notification.module"
import { OpenGraphImageHttpModule } from "@/delivery/http/openGraphImage/openGraphImage.module"
import { ProxyHttpModule } from "@/delivery/http/proxy/proxy.module"
import { ReleaseSubscriptionHttpModule } from "@/delivery/http/releaseSubscription/releaseSubscription.module"
import { SitemapHttpModule } from "@/delivery/http/sitemap/sitemap.module"
import { TrackingDataHttpModule } from "@/delivery/http/trackingData/trackingData.module"
import { UserHttpModule } from "@/delivery/http/user/user.module"
import { UserFollowHttpModule } from "@/delivery/http/userFollow/userFollow.module"

@Module({
  imports: [
    AnalyticsHttpModule,
    AuthHttpModule,
    CommunityListsHttpModule,
    MediaDetailsHttpModule,
    MediaItemHttpModule,
    MediaListHttpModule,
    MediaListViewHttpModule,
    MediaRatingHttpModule,
    NotificationHttpModule,
    OpenGraphImageHttpModule,
    ProxyHttpModule,
    ReleaseSubscriptionHttpModule,
    SitemapHttpModule,
    TrackingDataHttpModule,
    UserHttpModule,
    UserFollowHttpModule,
  ],
})
export class HttpDeliveryModule {}
