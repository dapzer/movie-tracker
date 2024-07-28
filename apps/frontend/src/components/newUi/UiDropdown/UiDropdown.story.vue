<script setup lang="ts">

import { UiDropdown } from "~/components/newUi/UiDropdown"
import { UiTypography } from "~/components/newUi/UiTypography"
import UiContainer from "~/components/ui/UiContainer.vue"
import UiDropdownGroup from "~/components/newUi/UiDropdown/UiDropdownGroup.vue"
import UiDropdownItem from "~/components/newUi/UiDropdown/UiDropdownItem.vue"
import UiDropdownSeparator from "~/components/newUi/UiDropdown/UiDropdownSeparator.vue"
import { ref } from "vue"
import UiDropdownTriggerWithArrow from "~/components/newUi/UiDropdown/UiDropdownTriggerWithArrow.vue"

const isOpen = ref(false)
const align = ref<'start' | 'center' | 'end'>('start')
const side = ref<'top' | 'right' | 'bottom' | 'left'>('bottom')
</script>

<template>
  <Story title="UiDropdown">
    <template #default>
      <Variant title="Default">
        <UiContainer>
          <UiDropdown
            :align="align"
            :indent="24"
            :side="side"
          >
            <template #trigger>
              <UiTypography>Click me</UiTypography>
            </template>

            <template #content>
              <UiDropdownGroup>
                <UiDropdownItem>
                  <template #content>
                    First item
                  </template>
                </UiDropdownItem>
                <UiDropdownItem>
                  <template #content>
                    Second item
                  </template>
                </UiDropdownItem>
                <UiDropdownItem>
                  <template #content>
                    Third item
                  </template>
                </UiDropdownItem>
              </UiDropdownGroup>
              <UiDropdownSeparator />

              <UiTypography>
                Basic text, not dropdown item
              </UiTypography>
            </template>
          </UiDropdown>
        </UiContainer>
      </Variant>
      <Variant title="WithArrowInTrigger">
        <UiContainer>
          <UiDropdown
            v-model="isOpen"
            :align="align"
            :indent="24"
            :side="side"
          >
            <template #trigger>
              <UiDropdownTriggerWithArrow :is-open="isOpen">
                <UiTypography>Click me</UiTypography>
              </UiDropdownTriggerWithArrow>
            </template>

            <template #content>
              <UiDropdownGroup>
                <UiDropdownItem>
                  <template #content>
                    First item
                  </template>
                </UiDropdownItem>
                <UiDropdownItem>
                  <template #content>
                    Second item
                  </template>
                </UiDropdownItem>
                <UiDropdownItem>
                  <template #content>
                    Third item
                  </template>
                </UiDropdownItem>
              </UiDropdownGroup>
              <UiDropdownSeparator />

              <UiTypography>
                Basic text, not dropdown item
              </UiTypography>
            </template>
          </UiDropdown>
        </UiContainer>
      </Variant>
    </template>

    <template #controls>
      <HstSelect
        v-model="align"
        title="Align"
        :options="['start', 'center', 'end']"
      />
      <HstSelect
        v-model="side"
        title="Side"
        :options="['top', 'right', 'bottom', 'left']"
      />
    </template>
  </Story>
</template>

<style module lang="scss">
.right {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
