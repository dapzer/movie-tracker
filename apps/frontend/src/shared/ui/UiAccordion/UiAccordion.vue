<script setup lang="ts">
import { UiButton } from "~/shared/ui/UiButton"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UiAccordionProps {
  items: Array<{
    value: string
    title: string
    content: string
  }>
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
      v-for="(item, index) in props.items"
      :key="index"
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
          <UiTypography>
            {{ item.content }}
          </UiTypography>
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
