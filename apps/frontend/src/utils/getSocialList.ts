import {
  DiscordIcon,
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  TelegramIcon,
  TiktokIcon,
  TwitterIcon,
  YoutubeIcon
} from "~/components/ui/icons"

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
    icon: string;
    url: string;
  }[] = [];

  if (socialIds?.instagram) {
    result.push({
      icon: InstagramIcon,
      url: `https://instagram.com/${socialIds?.instagram}`
    });
  }
  if (socialIds?.twitter) {
    result.push({ icon: TwitterIcon, url: `https://x.com/${socialIds?.twitter}` }
    );
  }
  if (socialIds?.tiktok) {
    result.push({ icon: TiktokIcon, url: `https://tiktok.com/@${socialIds?.tiktok}` });
  }
  if (socialIds?.youtube) {
    result.push({
      icon: YoutubeIcon,
      url: `https://youtube.com/${socialIds?.youtube}`
    });
  }
  if (socialIds.telegram) {
    result.push({
      icon: TelegramIcon,
      url: `https://t.me/${socialIds.telegram}`
    })
  }
  if (socialIds.discord) {
    result.push({
      icon: DiscordIcon,
      url: `https://discord.gg/${socialIds.telegram}`
    })
  }
  if (socialIds?.facebook) {
    result.push({
      icon:  FacebookIcon,
      url: `https://facebook.com/${socialIds?.facebook}`
    });
  }
  if (socialIds.github) {
    result.push({
      icon:  GithubIcon,
      url: `https://github.com/${socialIds.github}`
    })
  }

  return result;
}
