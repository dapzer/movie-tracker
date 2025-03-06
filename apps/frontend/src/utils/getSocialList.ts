import { h, type VNode } from "vue"
import { UiIcon } from "../shared/ui/UiIcon"

export interface SocialIdsType {
  instagram?: string | null;
  twitter?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  facebook?: string | null;
  github?: string | null;
  telegram?: string | null;
  discord?: string | null;
}

export const getSocialList = (socialIds: SocialIdsType) => {
  const result: {
    icon: VNode;
    url: string;
  }[] = [];

  if (socialIds?.instagram) {
    result.push({
      icon: h(UiIcon, { name: "icon:instagram" }),
      url: `https://instagram.com/${socialIds?.instagram}`
    });
  }
  if (socialIds?.twitter) {
    result.push({ icon: h(UiIcon, { name: "icon:twitter" }), url: `https://x.com/${socialIds?.twitter}` }
    );
  }
  if (socialIds?.tiktok) {
    result.push({ icon: h(UiIcon, { name: "icon:tiktok" }), url: `https://tiktok.com/@${socialIds?.tiktok}` });
  }
  if (socialIds?.youtube) {
    result.push({
      icon: h(UiIcon, { name: 'icon:youtube' }),
      url: `https://youtube.com/${socialIds?.youtube}`
    });
  }
  if (socialIds.telegram) {
    result.push({
      icon: h(UiIcon, { name: 'icon:telegram' }),
      url: `https://t.me/${socialIds.telegram}`
    })
  }
  if (socialIds.discord) {
    result.push({
      icon: h(UiIcon, { name: 'icon:discord' }),
      url: `https://discord.gg/invite/${socialIds.discord}`
    })
  }
  if (socialIds?.facebook) {
    result.push({
      icon: h(UiIcon, { name: 'icon:facebook' }),
      url: `https://facebook.com/${socialIds?.facebook}`
    });
  }
  if (socialIds.github) {
    result.push({
      icon: h(UiIcon, { name: 'icon:github' }),
      url: `https://github.com/${socialIds.github}`
    })
  }

  return result;
}
