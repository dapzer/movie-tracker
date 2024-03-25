<script lang="ts" setup>

import UiContentCard from "~/components/ui/UiContentCard.vue";
import UiTypography from "~/components/ui/UiTypography.vue";
import { computed } from "vue";
import UiSkeleton from "~/components/ui/UiSkeleton.vue";
import { useGetAnalyticsRecordsApi } from "~/api/analytics/useAnalyticsApi";

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
  <UiContentCard :title="$t('dashboard.dataSummary')">
    <ul>
      <UiTypography
        v-for="(record, index) in records"
        :key="index"
        as="li"
        variant="listItem"
      >
        {{ record.label }}:
        <UiTypography
          as="span"
          variant="listItemValue"
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
  </UiContentCard>
</template>

<style lang="scss" module>

</style>
