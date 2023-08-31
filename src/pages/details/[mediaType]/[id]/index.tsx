import type { NextPage, NextPageContext } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { detailApi } from '@/api/fetchApi';
import { Details as DetailsType } from '@/types/Details';
import { DetailsPageContainer } from '@/components/containers/deteils-page/DetailsPageContainer';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { Person } from '@/types/Person';
import { Typography } from '@/components/ui/typography/UiTypography';

const Details: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ details, mediaType, locale }) => {
  const router = useRouter();
  const { t } = useTranslation('errors');
  const title = details?.title || details?.original_title || details?.name || 'Error';

  return (
    <>
      <NextSeo
        title={title}
        description={details?.overview || details?.biography || 'Error'}
        openGraph={{ url: `https://movie-tracker.dapzer.ru${router.asPath}` }}
      />

      {details ? (
        <DetailsPageContainer details={details} mediaType={mediaType} locale={locale} />
      ) : (
        <div className={'container'}>
          <Typography as="h2" variant="title2">
            {t('getDetails')}
          </Typography>
        </div>
      )}
    </>
  );
};

export async function getServerSideProps({ query, locale }: NextPageContext) {
  const data = await detailApi<DetailsType.RootObject & Person.RootObject>({
    mediaType: query.mediaType as string,
    mediaId: Number(query.id),
    language: locale!,
  });
  return {
    props: { details: data, mediaType: query.mediaType as string, locale: locale as string },
  };
}

export default Details;
