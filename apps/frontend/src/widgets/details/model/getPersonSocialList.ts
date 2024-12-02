import type { TmdbPersonExternalIdsType } from "@movie-tracker/types";
import type { PersonSocialType } from "~/widgets/details/model/PersonSocialType";
import { FacebookIcon, InstagramIcon, TiktokIcon, TwitterIcon, YoutubeIcon } from "~/components/ui/icons"

export const getPersonSocialList = (externalIds?: TmdbPersonExternalIdsType) => {
  const result: PersonSocialType[] = [];

  if (externalIds?.instagram_id) {
    result.push({
      icon: InstagramIcon,
      url: `https://instagram.com/${externalIds?.instagram_id}`
    });
  }
  if (externalIds?.twitter_id) {
    result.push({ icon: TwitterIcon, url: `https://x.com/${externalIds?.twitter_id}` }
    );
  }
  if (externalIds?.tiktok_id) {
    result.push({ icon: TiktokIcon, url: `https://tiktok.com/@${externalIds?.tiktok_id}` });
  }
  if (externalIds?.youtube_id) {
    result.push({
      icon: YoutubeIcon,
      url: `https://youtube.com/${externalIds?.youtube_id}`
    });
  }
  if (externalIds?.facebook_id) {
    result.push({
      icon:  FacebookIcon,
      url: `https://facebook.com/${externalIds?.facebook_id}`
    });
  }

  return result;
};
