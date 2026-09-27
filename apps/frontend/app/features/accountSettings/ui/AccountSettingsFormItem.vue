<script setup lang="ts">
import AccountSettingsRow from "~/features/accountSettings/ui/AccountSettingsRow.vue"
import { UiButton } from "~/shared/ui/UiButton"

interface AccountSettingsFormItemProps {
  title: string
  description?: string
  disabled?: boolean
}

const props = defineProps<AccountSettingsFormItemProps>()
</script>

<template>
  <AccountSettingsRow
    :title="props.title"
    :description="props.description"
  >
    <div :class="$style.content">
      <slot />
      <UiButton
        :class="$style.submitButton"
        :disabled="props.disabled"
        type="submit"
      >
        {{ $t("ui.change") }}
      </UiButton>
    </div>
  </AccountSettingsRow>
</template>

<style module lang="scss">
@use "~/shared/styles/variables" as *;
@use "~/shared/styles/mixins" as *;

.wrapper {
  gap: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;

  @include mobileDevice() {
    align-items: flex-start;
    flex-direction: column;
  }
}

.title {
  color: var(--c-text);
}

.header {
  flex-shrink: 0;
}

.description {
  margin-top: 8px;
}

.content {
  gap: 8px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;

  @include mobileDevice() {
    flex-direction: column;
  }
}

.submitButton {
  white-space: nowrap;

  @include mobileDevice() {
    width: 100%;
  }
}
</style>
