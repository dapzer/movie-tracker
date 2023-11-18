import { BackBtn } from '@/components/core/back-btn/BackBtn';
import React from 'react';
import { SeasonDetails } from '@/types/SeasonDetails';
import { SeasonsDetails } from '@/components/details-page/seasons-details/SeasonsDetails';

interface SeasonsPageContainerProps {
  data: SeasonDetails.RootObjectWithDetails;
  mediaType: string;
  locale: string;
}

export const SeasonsPageContainer = ({ data, mediaType, locale }: SeasonsPageContainerProps) => {
  return (
    <div className={'container'}>
      <BackBtn />

      <SeasonsDetails initialData={data} mediaType={mediaType} locale={locale} />
    </div>
  );
};
