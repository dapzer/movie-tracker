import { UiModal } from '@/components/ui/modal/UiModal';
import { VideoPreviewCard } from './VideoPreviewCard';
import styles from './video-card.module.scss';

interface VideoCardProps {
  previewUrl: string;
  videoUrl: string;
  releaseDate: Date;
  title: string;
}

export const VideoCard = (props: VideoCardProps) => {
  const { videoUrl, previewUrl, title, releaseDate } = props;

  return (
    <UiModal
      title={title}
      btnClass={styles['trigger_btn']}
      btnTitle={<VideoPreviewCard previewUrl={previewUrl} title={title} releaseDate={releaseDate} />}
    >
      <div className={styles['frame']}>
        <iframe
          src={videoUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </UiModal>
  );
};
