import { h } from "vue"
import { UiIcon } from "~/shared/ui/UiIcon"

export const authProvidersList = [
  {
    title: "Google",
    provider: "google",
    icon: h(UiIcon, { name: "icon:google" }),
  },
  {
    title: "Yandex",
    provider: "yandex",
    icon: h(UiIcon, { name: "icon:yandex" }),
  },
  {
    title: "VK",
    provider: "vk",
    icon: h(UiIcon, { name: "icon:vkontakte" }),
  },
  {
    title: "GitHub",
    provider: "github",
    icon: h(UiIcon, { name: "icon:github-provider" }),
  },
]
