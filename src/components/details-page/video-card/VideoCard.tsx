import React, { FC } from 'react';
import UiModal from '../../ui/modal/UiModal';
import VideoPreviewCard from './VideoPreviewCard';
import styles from './video-card.module.scss';

interface Props {
  previewUrl: string;
  videoUrl: string;
  releaseDate: Date;
  title: string;
}

const VideoCard: FC<Props> = ({ videoUrl, previewUrl, title, releaseDate }) => {
  return (
    <UiModal title={title}
             btnClass={styles['trigger_btn']}
             btnTitle={
               <VideoPreviewCard
                 previewUrl={previewUrl}
                 title={title}
                 releaseDate={releaseDate}
               />
             }>
      <div className={styles['frame']}>
        <iframe src={videoUrl} title={title}
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen></iframe>
      </div>
    </UiModal>
  );
};

export default VideoCard;
