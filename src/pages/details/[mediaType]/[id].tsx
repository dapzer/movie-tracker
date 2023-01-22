import type { NextPage, NextPageContext } from 'next';
import { detailApi } from '@/api/fetchApi';
import { Details as DetailsType } from '@/types/Details';
import DetailsPageContainer from '@/components/containers/deteils-page/DetailsPageContainer';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { Person } from '@/types/Person';

interface Props {
  details: DetailsType.RootObject;
  mediaType: string;
  locale: string;
}

const Details: NextPage<Props> = ({ details, mediaType, locale }) => {
  const router = useRouter();
  const { t } = useTranslation('errors');
  const title = details && details?.original_title || details?.title || details?.name || 'Error';

  return (
    <>
      <NextSeo
        title={title}
        description={details?.overview || details?.biography || 'Error'}
        openGraph={{ url: `https://movie-tracker.dapzer.ru${router.asPath}` }}
      />

      {details ? <DetailsPageContainer details={details} mediaType={mediaType} locale={locale} />
        : (
          <div className={'container'}>
            <h2>{t('getDetails')}</h2>
          </div>
        )
      }
    </>
  );
};

export default Details;

export async function getServerSideProps({ query, locale }: NextPageContext) {
  const data = await detailApi<DetailsType.RootObject | Person.RootObject>({
    mediaType: query.mediaType,
    mediaId: query.id,
    language: locale,
  });

  return {
    props: { details: data, mediaType: query.mediaType, locale },
  };

}
