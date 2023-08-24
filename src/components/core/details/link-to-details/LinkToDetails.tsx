import React, { FC } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import styles from './link-to-details.module.scss';
import { Typography } from '@/components/ui/typography/UiTypography';

interface Props {
  mediaId: number;
  mediaType?: string;
  title?: string;
}

const LinkToDetails: FC<Props> = ({ mediaId, mediaType, title }) => {
  const { t } = useTranslation('buttons');

  return (
    <Typography as={Link} variant="linkUnderlined" href={`/details/${mediaType}/${mediaId}`} className={styles['link']}>
      {title ? title : t('more')}
    </Typography>
  );
};

export default LinkToDetails;
