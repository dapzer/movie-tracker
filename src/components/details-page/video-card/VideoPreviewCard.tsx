import React, { FC } from 'react';
import Image from 'next/image';
import styles from './video-card.module.scss';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  previewUrl: string;
  releaseDate: Date;
  title: string;
}

const VideoPreviewCard: FC<Props> = ({ previewUrl, title, releaseDate }) => {
  const { t } = useTranslation('card');
  return (
    <div className={styles['body']}>
      <div className={styles['image']}>
        <Image
          src={previewUrl ? previewUrl : '/defaultPoster.svg'}
          blurDataURL={previewUrl ? previewUrl : '/defaultPoster.svg'}
          placeholder='blur'
          width={260}
          height={147}
          objectFit='contain'
          sizes='33wv'
          alt='Image'
        />
        <div className={styles['overlay']}>
          <svg>
            <use href={'/icon-play.svg#svg'}></use>
          </svg>
        </div>
      </div>

      <div className={styles['info']}>
        <span className={styles['release']}>{t('release_date')} {new Date(releaseDate).toLocaleDateString()}</span>
        <p className={styles['title']}>{title}</p>
      </div>
    </div>
  );
};

export default VideoPreviewCard;
