<script setup lang="ts">
interface UiMarkdownProps {
  value: string
}

const props = defineProps<UiMarkdownProps>()

console.log(props.value)
</script>

<template>
  <MDC :value="props.value" />
</template>

<style scoped lang="scss">

</style>
