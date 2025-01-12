import type { SocialIdsType } from "~/utils/getSocialList"

interface TeamMemberType {
  name: string;
  userId?: string;
  position: string;
  avatar?: string;
  socials: SocialIdsType;
}

export const teamMembers: TeamMemberType[] = [
  {
    avatar: 'danilaVoronkov.webp',
    name: 'Danila Voronkov',
    userId: 'danila-voronkov',
    position: 'Founder & Developer',
    socials: {
      github: "dapzer",
      telegram: "dapzer"
    }
  },
  {
    avatar: 'melkam.jpeg',
    name: 'MelKam',
    userId: 'melkam',
    position: 'UI-UX Designer',
    socials: {
      github: "MellKam",
      telegram: "mellkam",
      instagram: "mel._.kam"
    }
  },
  {
    name: 'Mariia Deomidova',
    userId: 'mariia-deomidova',
    position: 'UI-UX Designer',
    socials: {
      telegram: "q",
    }
  },

]
