<script lang="ts" setup>

import { computed } from "vue";
import { useGetAnalyticsRecordsApi } from "~/api/analytics/useAnalyticsApi";
import DasboardCard from "~/features/dashboard/ui/DasboardCard.vue"
import { UiTypography } from "~/components/ui/UiTypography"
import { UiSkeleton } from "~/components/ui/UiSkeleton"

const getAnalyticsRecordsApi = useGetAnalyticsRecordsApi();

const records = computed(() => {
  return [
    {
      label: "Users",
      value: getAnalyticsRecordsApi.data?.value?.users ?? 0
    },
    {
      label: "Media Lists",
      value: getAnalyticsRecordsApi.data?.value?.mediaLists ?? 0
    },
    {
      label: "Media Items",
      value: getAnalyticsRecordsApi.data?.value?.mediaItems ?? 0
    },
    {
      label: "Media Details",
      value: getAnalyticsRecordsApi.data?.value?.mediaDetails ?? 0
    }
  ];
});

</script>

<template>
  <DasboardCard :title="$t('dashboard.dataSummary')">
    <ul>
      <UiTypography
        v-for="(record, index) in records"
        :key="index"
        as="li"
        variant="label"
      >
        {{ record.label }}:
        <UiTypography
          as="span"
        >
          <template v-if="!getAnalyticsRecordsApi.isLoading.value">
            {{ record.value }}
          </template>

          <UiSkeleton
            v-else
            :width="80"
            is-inline
          />
        </UiTypography>
      </UiTypography>
    </ul>
  </DasboardCard>
</template>

<style lang="scss" module>

</style>
