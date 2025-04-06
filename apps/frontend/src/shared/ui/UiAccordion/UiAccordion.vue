<script setup lang="ts">
import type { ComponentOrTag } from "~/shared/types/ComponentOrTag"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"

export interface UiAccordionItem {
  value: string
  title: string
  content?: string
  as?: ComponentOrTag
  asProps?: Record<string, unknown>
}

interface UiAccordionProps {
  items: Array<UiAccordionItem>
  initialExpanded?: boolean
}

const props = defineProps<UiAccordionProps>()
const model = defineModel<string | string[]>()
</script>

<template>
  <AccordionRoot
    v-model="model"
    :class="$style.wrapper"
    type="multiple"
  >
    <template
      v-for="item in props.items"
      :key="item.value"
    >
      <AccordionItem
        :class="$style.item"
        :value="item.value"
      >
        <AccordionHeader :class="$style.header">
          <AccordionTrigger
            :as="UiButton"
            variant="text"
            :class="$style.trigger"
          >
            {{ item.title }}

            <UiIcon
              :class="$style.icon"
              name="icon:arrow"
            />
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <UiTypography v-if="!item.as">
            {{ item.content }}
          </UiTypography>
          <component
            :is="item.as"
            v-bind="item.asProps"
            v-else
          >
            {{ item.content }}
          </component>
        </AccordionContent>
      </AccordionItem>
      <UiDivider />
    </template>
  </AccordionRoot>
</template>

<style module lang="scss">
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  display: flex;
  width: 100%;
}

.item {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &[data-state="open"] {
    .icon {
      transform: rotate(180deg);
    }
  }
}

.trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  text-align: left;
  font-size: var(--fs-subheading);
  line-height: var(--lh-subheading);
  font-weight: var(--fw-medium);
}

.icon {
  color: var(--c-white-60);
  width: 10px;
  margin-right: 14px;
}
</style>
