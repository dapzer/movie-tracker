import type { SocialIdsType } from "~/shared/ui/UiSocialList/model/getSocialList"

interface TeamMemberType {
  name: string
  userId?: string
  position: string
  avatar?: string
  socials: SocialIdsType
  mediaListHumanFriendlyId: string
}

export const teamMembers: TeamMemberType[] = [
  {
    avatar: "danilaVoronkov.webp",
    name: "Danila Voronkov",
    userId: "danila-voronkov",
    position: "Founder & Developer",
    mediaListHumanFriendlyId: "qffaubxdiv",
    socials: {
      github: "dapzer",
      telegram: "dapzer",
    },
  },
  {
    avatar: "melkam.jpeg",
    name: "MelKam",
    userId: "melkam",
    position: "UI-UX Designer",
    mediaListHumanFriendlyId: "fbnqp8nc3n",
    socials: {
      github: "MellKam",
      telegram: "mellkam",
      instagram: "mel._.kam",
    },
  },
  {
    name: "Mariia Deomidova",
    userId: "mariia-deomidova",
    position: "UI-UX Designer",
    mediaListHumanFriendlyId: "ndj61hrkoo",
    socials: {
      telegram: "mariia_deomidova",
    },
  },

]
