import React, { FC } from 'react';
import UiModal from '../../ui/modal/UiModal';
import { ContentNames } from '../../../types/ContentNames';
import Details from './Details';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  mediaType?: string;
  mediaId: number;
}

const DetailsModal: FC<Props> = ({ mediaId, mediaType }) => {
  const { t } = useTranslation('card');

  return (
    <UiModal title={mediaType === ContentNames.Movie ? t('about_movie') : t('about_series')} fullWidth>
      <Details mediaType={mediaType} mediaId={mediaId} />
    </UiModal>
  );
};

export default DetailsModal;
