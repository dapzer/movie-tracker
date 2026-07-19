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
        :width="90"
        is-fixed-width
      />
    </UiTableCell>
    <UiTableCell>
      <UiSkeleton
        :width="180"
        is-fixed-width
      />
    </UiTableCell>
    <UiTableCell>
      <UiUserProfileLinkSkeleton />
    </UiTableCell>
    <UiTableCell>
      <UiSkeleton
        :width="140"
        is-fixed-width
      />
    </UiTableCell>
    <UiTableCell>
      <UiSkeleton
        :width="140"
        is-fixed-width
      />
    </UiTableCell>
    <UiTableCell>
      <UiSkeleton
        :width="70"
        is-fixed-width
      />
    </UiTableCell>
    <UiTableCell align="right">
      <UiSkeleton
        :width="24"
        :height="24"
        is-fixed-width
      />
    </UiTableCell>
  </UiTableRow>
</template>
