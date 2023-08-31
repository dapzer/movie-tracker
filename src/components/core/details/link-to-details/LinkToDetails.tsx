import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import styles from './link-to-details.module.scss';
import { Typography } from '@/components/ui/typography/UiTypography';

interface LinkToDetailsProps {
  mediaId: number;
  mediaType?: string;
  title?: string;
}

export const LinkToDetails = (props: LinkToDetailsProps) => {
  const { mediaId, mediaType, title } = props;
  const { t } = useTranslation('buttons');

  return (
    <Typography as={Link} variant="linkUnderlined" href={`/details/${mediaType}/${mediaId}`} className={styles['link']}>
      {title ? title : t('more')}
    </Typography>
  );
};
