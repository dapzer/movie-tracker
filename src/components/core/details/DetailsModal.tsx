import React, { FC } from 'react';
import UiModal from '../../ui/modal/UiModal';
import Details from './Details';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  mediaType?: string;
  mediaId: number;
}

const DetailsModal: FC<Props> = ({ mediaId, mediaType }) => {
  const { t } = useTranslation('card');

  return (
    <UiModal title={t(`about_${mediaType}`)} fullWidth>
      <Details mediaType={mediaType} mediaId={mediaId} />
    </UiModal>
  );
};

export default DetailsModal;
