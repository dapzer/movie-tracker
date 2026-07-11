<script setup lang="ts">
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
import { UiTableCell, UiTableRow } from "~/shared/ui/UiTable"
import { UiUserProfileLinkSkeleton } from "~/shared/ui/UiUserProfileLink"
</script>

<template>
  <UiTableRow>
    <UiTableCell>
      <UiUserProfileLinkSkeleton />
    </UiTableCell>
    <UiTableCell>
      <UiSkeleton
        :width="260"
        is-fixed-width
      />
    </UiTableCell>
    <UiTableCell>
      <UiSkeleton
        :width="160"
        is-fixed-width
      />
    </UiTableCell>
  </UiTableRow>
</template>
