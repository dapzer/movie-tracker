<script setup lang="ts">

import UiTypography from '~/components/ui/UiTypography.vue';
import UiButton from '~/components/ui/UiButton.vue';
import UiLoadingIndicator from '~/components/ui/UiLoadingIndicator.vue';
import LanguageSelector from '../../languegeSelector/ui/LanguageSelector.vue';
import { useRouter } from 'vue-router';

interface EmailConfirmationMarkupProps {
  isError?: boolean
  isPending?: boolean
  successTitle?: string
  successDescription?: string
  error?: string
  errorDescription?: string
}

const props = defineProps<EmailConfirmationMarkupProps>()
const router = useRouter()

const backToMainPage = () => {
  router.push("/")
}
</script>

<template>
  <div :class="$style.wrapper">
    <LanguageSelector :class="$style.languageSelector" />
    <template v-if="isPending">
      <UiLoadingIndicator
        :size="64"
        :thickness="5"
      />
    </template>

    <template v-else-if="!isError && !isPending">
      <UiTypography
        as="span"
        variant="title2"
      >
        {{ props.successTitle }}
      </UiTypography>
      <UiTypography>
        {{ props.successDescription }}
      </UiTypography>
      <UiButton @click="backToMainPage()">
        {{ $t("ui.actions.backToMainPage") }}
      </UiButton>
    </template>

    <template v-else-if="isError">
      <UiTypography
        as="span"
        variant="title2"
      >
        {{ props.error }}
      </UiTypography>
      <UiTypography>
        {{ props.errorDescription }}
      </UiTypography>
      <UiButton @click="backToMainPage()">
        {{ $t("ui.actions.backToMainPage") }}
      </UiButton>
    </template>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;

  .languageSelector {
    position: absolute;
    top: 16px;
    left: var(--s-indent);
    z-index: 1;
  }
}
</style>
