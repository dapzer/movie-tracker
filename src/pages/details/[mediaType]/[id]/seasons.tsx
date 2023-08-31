import { InferGetServerSidePropsType, NextPage, NextPageContext } from 'next';
import { seasonsApi } from '@/api/fetchApi';
import { SeasonsPageContainer } from '@/components/containers/seasons-page/SeasonsPageContainer';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { Typography } from '@/components/ui/typography/UiTypography';

type SeasonsProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Seasons: NextPage<SeasonsProps> = (props) => {
  const { data, mediaType, locale } = props;
  const { t } = useTranslation('errors');
  const router = useRouter();
  const title = data?.details?.title || data?.details?.original_title || data?.details?.name || 'Error';

  return (
    <>
      <NextSeo
        title={title}
        description={data?.details?.overview || 'Error'}
        openGraph={{ url: `https://movie-tracker.dapzer.ru${router.asPath}` }}
      />

      {data ? (
        <SeasonsPageContainer data={data} mediaType={mediaType} locale={locale} />
      ) : (
        <div className={'container'}>
          <Typography as="h1" variant="title2">
            {t('getDetails')}
          </Typography>
        </div>
      )}
    </>
  );
};

export async function getServerSideProps({ query, locale }: NextPageContext) {
  const data = await seasonsApi({
    mediaType: query.mediaType as string,
    mediaId: Number(query.id),
    language: locale!,
  });

  return {
    props: {
      data,
      mediaType: query.mediaType as string,
      locale: locale as string,
    },
  };
}

export default Seasons;
