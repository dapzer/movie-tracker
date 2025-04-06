<script setup lang="ts">
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiTypography } from "~/shared/ui/UiTypography"
import { teamMembers } from "~/widgets/about/model/teamMembers"
import TeamMemberCard from "~/widgets/about/ui/team/TeamMemberCard.vue"
</script>

<template>
  <UiContainer
    :class="$style.wrapper"
    as="section"
  >
    <div :class="$style.header">
      <UiTypography
        variant="title2"
        as="h1"
      >
        {{ $t('about.team.title') }}
      </UiTypography>
      <UiTypography
        :class="$style.description"
        variant="subheading"
      >
        {{ $t('about.team.description') }}
      </UiTypography>
    </div>

    <div :class="$style.list">
      <TeamMemberCard
        v-for="(member, index) in teamMembers"
        :key="index"
        :name="member.name"
        :position="member.position"
        :avatar="member.avatar"
        :user-id="member.userId"
        :socials="member.socials"
        :media-list-human-friendly-id="member.mediaListHumanFriendlyId"
      />
    </div>
  </UiContainer>
</template>

<style module lang="scss">
@import "~/shared/styles/variables";
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 36px;
  margin-top: 96px;

  .header {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .description {
      color: var(--c-description);
    }
  }

  .list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;

    @include tabletDevice {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    @include mobileDevice {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
}
</style>
