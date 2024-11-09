<script setup lang="ts">

import UiTabs from "~/components/newUi/UiTabs/UiTabs.vue"
import UiTabTrigger from "~/components/newUi/UiTabs/UiTabTrigger.vue"
import UiTypography from "~/components/ui/UiTypography.vue"
import UiTabsPane from "~/components/newUi/UiTabs/UiTabsPane.vue"
import { ref } from "vue"

const currentTab = ref<string>()
</script>

<template>
  <Story
    group="ui-kit"
    title="UiTabs"
  >
    <template #default>
      <Variant title="Tabs">
        <UiTabs
          :tabs="[
            {
              key: 'tab1',
              label: 'Tab 1'
            },
            {
              key: 'tab2',
              label: 'Tab 2'
            },
            {
              key: 'tab3',
              label: 'Tab 3'
            },
            {
              key: 'tab4',
              label: 'Tab 4'
            },
            {
              key: 'tab5',
              label: 'Tab 5'
            }
          ] as const"
        >
          <template #afterTabs>
            <UiTypography>
              After tabs content
            </UiTypography>
          </template>
          <template #tab1>
            <UiTypography>
              Tab 1 content
            </UiTypography>
          </template>
          <template #tab2>
            <UiTypography>
              Tab 2 content
            </UiTypography>
          </template>
          <template #tab3>
            <UiTypography>
              Tab 3 content
            </UiTypography>
          </template>
          <template #tab4>
            <UiTypography>
              Tab 4 content
            </UiTypography>
          </template>
          <template #tab5>
            <UiTypography>
              Tab 5 content
            </UiTypography>
          </template>
        </UiTabs>
      </Variant>
      <Variant title="TabsPane">
        <UiTabsPane
          v-model="currentTab"
          :tabs="[
            {
              key: 'tab1',
              label: 'Tab 1'
            },
            {
              key: 'tab2',
              label: 'Tab 2'
            },
            {
              key: 'tab3',
              label: 'Tab 3'
            },
            {
              key: 'tab4',
              label: 'Tab 4'
            },
            {
              key: 'tab5',
              label: 'Tab 5'
            }
          ] as const"
        >
          <template #afterTabs>
            <UiTypography>
              After tabs content
            </UiTypography>
          </template>
          <template #content>
            <UiTypography>
              Tab content
            </UiTypography>
          </template>
        </UiTabsPane>
      </Variant>

      <Variant title="TabTrigger">
        <UiTabTrigger>
          Tab trigger
        </UiTabTrigger>
      </Variant>
    </template>
    <template #controls>
      <HstText
        v-model="currentTab"
        title="CurrentTab"
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
