<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';
import { useI18n, useSeoMeta, watch } from '#imports';
import { useRouter } from 'vue-router';
import UiContainer from '~/components/ui/UiContainer.vue';
import { SignUpForm } from '~/features/auth';

const { isAuthorized } = useAuth()
const router = useRouter()
const { t } = useI18n()

watch(() => isAuthorized.value, (isAuthorized) => {
  if (isAuthorized) {
    router.push('/')
  }
})

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${titleChunk} | ${t('auth.createAccount')}`;
  },
  ogTitle() {
    return `%s | ${t('auth.createAccount')}`;
  },
});

</script>

<template>
  <UiContainer>
    <SignUpForm :class="$style.wrapper" />
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  margin: 0 auto;
  max-width: 460px;
  width: 100%;
}
</style>
