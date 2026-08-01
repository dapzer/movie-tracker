<script setup lang="ts">
import { useLocalePath } from "#i18n"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiTabsPane } from "~/shared/ui/UiTabs"

export type LegalsTab = "termsOfUse" | "privacyPolicy" | "communityPolicy"

interface LegalsTabsProps {
  tab: LegalsTab
}

const props = defineProps<LegalsTabsProps>()

const localePath = useLocalePath()
</script>

<template>
  <UiContainer
    :class="$style.wrapper"
    as="section"
  >
    <UiTabsPane
      :model-value="props.tab"
      :tabs="[
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
      ] as const"
    >
      <template #content>
        <slot />
      </template>
    </UiTabsPane>
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  margin-top: 70px;
}
</style>
