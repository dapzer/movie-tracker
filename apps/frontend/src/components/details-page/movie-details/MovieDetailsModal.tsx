import { UiModal } from '@/components/ui/modal/UiModal';
import { MovieDetails } from './MovieDetails';
import useTranslation from 'next-translate/useTranslation';

interface MovieDetailsModalProps {
  mediaType: string;
  mediaId: number;
}

export const MovieDetailsModal = (props: MovieDetailsModalProps) => {
  const { mediaType, mediaId } = props;
  const { t } = useTranslation('card');

  return (
    <UiModal title={t(`about_${mediaType}`)} fullWidth>
      <MovieDetails mediaType={mediaType} mediaId={mediaId} />
    </UiModal>
  );
};
