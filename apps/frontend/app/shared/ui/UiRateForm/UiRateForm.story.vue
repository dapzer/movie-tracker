<script setup lang="ts">
import UiRateForm from "~/shared/ui/UiRateForm/UiRateForm.vue"
</script>

<template>
  <Story
    group="ui-kit"
    title="UiRateForm"
    :layout="{
      type: 'grid',
      width: 456,
    }"
  >
    <Variant title="New rating">
      <UiRateForm title="S1.E1 ∙ Pilot" />
    </Variant>

    <Variant title="Existing rating">
      <UiRateForm
        title="S1.E1 ∙ Pilot"
        :current-rating="8"
      />
    </Variant>

    <Variant title="Zero rating">
      <UiRateForm
        title="S1.E1 ∙ Pilot"
        :current-rating="0"
      />
    </Variant>

    <Variant title="Pending">
      <UiRateForm
        title="S1.E1 ∙ Pilot"
        :current-rating="6"
        is-pending
      />
    </Variant>

    <Variant title="Long title">
      <UiRateForm title="S1.E12 ∙ The episode with a very long title that should remain readable inside the rating form" />
    </Variant>
  </Story>
</template>
