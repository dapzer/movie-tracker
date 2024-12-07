<script setup lang="ts">

import UiTrimmedText from "~/components/ui/UiTrimmedText/UiTrimmedText.vue"
</script>

<template>
  <Story
    title="UiTrimmedText"
    group="ui-kit"
  >
    <template #default>
      <UiTrimmedText
        :max-lines="2"
        :max-chars-in-line="82"
        text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, dolor, harum! Blanditiis consectetur doloribus ducimus illo iusto maiores possimus quibusdam sunt tenetur voluptatum? Adipisci animi ea hic ipsa officia voluptatem.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, dolor, harum! Blanditiis consectetur doloribus ducimus illo iusto maiores possimus quibusdam sunt tenetur voluptatum? Adipisci animi ea hic ipsa officia voluptatem.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, dolor, harum! Blanditiis consectetur doloribus ducimus illo iusto maiores possimus quibusdam sunt tenetur voluptatum? Adipisci animi ea hic ipsa officia voluptatem.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, dolor, harum! Blanditiis consectetur doloribus ducimus illo iusto maiores possimus quibusdam sunt tenetur voluptatum? Adipisci animi ea hic ipsa officia voluptatem.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, dolor, harum! Blanditiis consectetur doloribus ducimus illo iusto maiores possimus quibusdam sunt tenetur voluptatum? Adipisci animi ea hic ipsa officia voluptatem.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, dolor, harum! Blanditiis consectetur doloribus ducimus illo iusto maiores possimus quibusdam sunt tenetur voluptatum? Adipisci animi ea hic ipsa officia voluptatem."
      />
      <UiTrimmedText
        :max-chars-in-line="82"
        :max-lines="2"
        text="Lorem ipsum dolor sit amet."
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
