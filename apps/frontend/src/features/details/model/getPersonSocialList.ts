import type { TmdbPersonExternalIdsType } from "@movie-tracker/types";
import type { PersonSocialType } from "~/features/details/model/PersonSocialType";

export const getPersonSocialList = (externalIds?: TmdbPersonExternalIdsType) => {
  const result: PersonSocialType[] = [];

  if (externalIds?.instagram_id) {
    result.push({
      name: "Instagram",
      url: `https://instagram.com/${externalIds?.instagram_id}`
    });
  }
  if (externalIds?.twitter_id) {
    result.push({ name: "X (Twitter)", url: `https://x.com/${externalIds?.twitter_id}` }
    );
  }
  if (externalIds?.tiktok_id) {
    result.push({ name: "TikTok", url: `https://tiktok.com/@${externalIds?.tiktok_id}` });
  }
  if (externalIds?.youtube_id) {
    result.push({
      name: "Youtube",
      url: `https://youtube.com/${externalIds?.youtube_id}`
    });
  }
  if (externalIds?.facebook_id) {
    result.push({
      name: "Facebook",
      url: `https://facebook.com/${externalIds?.facebook_id}`
    });
  }

  return result;
};
