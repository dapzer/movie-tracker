import type { VNode } from "vue"
import { h } from "vue"
import { UiIcon } from "../../UiIcon"

export interface SocialIdsType {
  instagram?: string | null
  twitter?: string | null
  tiktok?: string | null
  youtube?: string | null
  facebook?: string | null
  github?: string | null
  telegram?: string | null
  discord?: string | null
}

export function getSocialList(socialIds: SocialIdsType) {
  const result: {
    icon: VNode
    url: string
    name: string
  }[] = []

  if (socialIds?.instagram) {
    result.push({
      icon: h(UiIcon, { name: "icon:instagram" }),
      url: `https://instagram.com/${socialIds?.instagram}`,
      name: "instagram",
    })
  }
  if (socialIds?.twitter) {
    result.push({ icon: h(UiIcon, { name: "icon:twitter" }), url: `https://x.com/${socialIds?.twitter}`, name: "x" },
    )
  }
  if (socialIds?.tiktok) {
    result.push({ icon: h(UiIcon, { name: "icon:tiktok" }), url: `https://tiktok.com/@${socialIds?.tiktok}`, name: "tiktok" })
  }
  if (socialIds?.youtube) {
    result.push({
      icon: h(UiIcon, { name: "icon:youtube" }),
      url: `https://youtube.com/${socialIds?.youtube}`,
      name: "youtube",
    })
  }
  if (socialIds.telegram) {
    result.push({
      icon: h(UiIcon, { name: "icon:telegram" }),
      url: `https://t.me/${socialIds.telegram}`,
      name: "telegram",
    })
  }
  if (socialIds.discord) {
    result.push({
      icon: h(UiIcon, { name: "icon:discord" }),
      url: `https://discord.gg/invite/${socialIds.discord}`,
      name: "discord",
    })
  }
  if (socialIds?.facebook) {
    result.push({
      icon: h(UiIcon, { name: "icon:facebook" }),
      url: `https://facebook.com/${socialIds?.facebook}`,
      name: "facebook",
    })
  }
  if (socialIds.github) {
    result.push({
      icon: h(UiIcon, { name: "icon:github" }),
      url: `https://github.com/${socialIds.github}`,
      name: "github",
    })
  }

  return result
}
