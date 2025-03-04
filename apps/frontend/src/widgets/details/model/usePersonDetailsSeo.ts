import type { TmdbPersonType } from '@movie-tracker/types';
import { getProxiedImageUrl, useI18n, useSeoMeta } from '#imports';
import { generateApiUrl } from '@movie-tracker/utils';
import { computed } from 'vue';

export const usePersonDetailsSeo = (person?: TmdbPersonType | null) => {
  const { t } = useI18n();
  const getOgApiUrl = generateApiUrl(import.meta.env.VITE_API_URL || '');

  const ogImage = computed(() => {
    return getOgApiUrl(`/open-graph-image`, {
      title: person?.name || '',
      imageUrl: person?.profile_path ? getProxiedImageUrl(person?.profile_path, undefined, true) : undefined,
      isAvatarPlaceholder: true
    });
  });

  useSeoMeta({
    titleTemplate(titleChunk) {
      return `${person?.name} | ${person?.known_for_department ? `${t(`details.department.${person?.known_for_department}`,
      )} | ` : ''}${titleChunk}`;
    },
    ogTitle: `%s | ${person?.name}`,
    description: person?.biography || t('seo.description'),
    ogDescription: person?.biography || t('seo.description'),
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImage: ogImage.value,
    twitterImage: ogImage.value,
    twitterCard: 'summary_large_image',
    twitterTitle: `%s | ${person?.name}`,
    twitterDescription: person?.biography || t('seo.description'),
  });
};
