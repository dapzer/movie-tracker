import Image from 'next/image';
import styles from './video-card.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { PlayIcon } from '@/components/ui/Icons';
import { Typography } from '@/components/ui/typography/UiTypography';

interface VideoPreviewCardProps {
  previewUrl: string;
  releaseDate: Date;
  title: string;
}

export const VideoPreviewCard = (props: VideoPreviewCardProps) => {
  const { previewUrl, releaseDate, title } = props;
  const { t, lang } = useTranslation('card');

  return (
    <div className={styles['body']}>
      <div className={styles['image']}>
        <Image src={previewUrl ? previewUrl : '/defaultPoster.svg'} width={260} height={147} sizes="33wv" alt="Image" />
        <div className={styles['overlay']}>
          <PlayIcon />
        </div>
      </div>

      <div className={styles['info']}>
        <Typography as="span" variant="textSmall">
          {t('release_date')} {new Date(releaseDate).toLocaleDateString(lang)}
        </Typography>
        <Typography className={styles['title']}>{title}</Typography>
      </div>
    </div>
  );
};
