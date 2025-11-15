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
    userId: "8d261648-996f-446a-a8ff-bbfbf6e239a5",
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
    userId: "4dd95203-a10c-419f-9023-d0e35d6c8ab3",
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
    userId: "8872dc58-fab8-44c4-bc8e-2eaaca1911fe",
    position: "UI-UX Designer",
    mediaListHumanFriendlyId: "ndj61hrkoo",
    socials: {
      telegram: "mariia_deomidova",
    },
  },

]
