<script setup lang="ts">
import type { UiTab } from "~/shared/ui/UiTabs"
import { useLocalePath } from "#i18n"
import { ref } from "vue"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiSlider } from "~/shared/ui/UiSlider"
import { UiTabsPaneWrapper, UiTabsWrapper } from "~/shared/ui/UiTabs"
import UiTabTrigger from "~/shared/ui/UiTabs/UiTabTrigger.vue"

export type LegalsTab = "termsOfUse" | "privacyPolicy" | "communityPolicy"

interface LegalsTabsProps {
  tab: LegalsTab
}

const props = defineProps<LegalsTabsProps>()

const localePath = useLocalePath()
const activeTab = ref<LegalsTab>(props.tab)
</script>

<template>
  <UiContainer
    :class="$style.wrapper"
    as="section"
  >
    <UiTabsWrapper>
      <UiTabsPaneWrapper>
        <UiSlider
          :data="[
            {
              key: 'termsOfUse',
              label: $t('ui.termsOfUse'),
              href: localePath('/legal/terms-of-use'),
            },
            {
              key: 'privacyPolicy',
              label: $t('ui.privacyPolicy'),
              href: localePath('/legal/privacy-policy'),
            },
            {
              key: 'communityPolicy',
              label: $t('ui.communityPolicy'),
              href: localePath('/legal/community-policy'),
            },
          ] as unknown as Array<UiTab>"
          max-width="max-content"
          :spaceing="4"
          hide-buttons
        >
          <template #slide="{ item }">
            <UiTabTrigger
              :key="item.key"
              :active="activeTab === item.key"
              :href="item.href"
            >
              {{ item.label }}
            </UiTabTrigger>
          </template>
        </UiSlider>
      </UiTabsPaneWrapper>
      <UiMarkdown :value="$t(`legals.${props.tab}`)" />
    </UiTabsWrapper>
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  margin-top: 70px;
}
</style>
