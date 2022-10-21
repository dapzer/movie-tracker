import React, { FC } from 'react';
import UiModal from '../../ui/modal/UiModal';
import { ContentNames } from '../../../types/ContentNames';
import Details from './Details';

interface Props {
  mediaType: string;
  mediaId: number;
}

const DetailsModal: FC<Props> = ({ mediaId, mediaType }) => {
  return (
    <UiModal title={`О ${mediaType === ContentNames.Movie ? 'фильме' : 'сериале'}`} fullWidth>
      <Details mediaType={mediaType} mediaId={mediaId} />
    </UiModal>
  );
};

export default DetailsModal;
