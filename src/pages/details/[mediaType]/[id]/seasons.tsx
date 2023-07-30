import { InferGetServerSidePropsType, NextPage, NextPageContext } from 'next';
import { seasonsApi } from '@/api/fetchApi';
import { SeasonsPageContainer } from '@/components/containers/seasons-page/SeasonsPageContainer';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

type SeasonsProps = NextPage<InferGetServerSidePropsType<typeof getServerSideProps>>;

const Seasons: SeasonsProps = ({ data, mediaType, locale }) => {
  const { t } = useTranslation('errors');
  const router = useRouter();
  const title = data?.details?.title || data?.details?.original_title || data?.details?.name || 'Error';

  return (
    <div>
      <NextSeo
        title={title}
        description={data?.details?.overview || 'Error'}
        openGraph={{ url: `https://movie-tracker.dapzer.ru${router.asPath}` }}
      />

      {data ? (
        <SeasonsPageContainer data={data} mediaType={mediaType} locale={locale} />
      ) : (
        <div className={'container'}>
          <h2>{t('getDetails')}</h2>
        </div>
      )}
    </div>
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
