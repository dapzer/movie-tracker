import React, { FC } from 'react';
import UiModal from '@/components/ui/modal/UiModal';
import MovieDetails from './MovieDetails';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  mediaType: string;
  mediaId: number;
}

const MovieDetailsModal: FC<Props> = ({ mediaId, mediaType }) => {
  const { t } = useTranslation('card');

  return (
    <UiModal title={t(`about_${mediaType}`)} fullWidth>
      <MovieDetails mediaType={mediaType} mediaId={mediaId} />
    </UiModal>
  );
};

export default MovieDetailsModal;
