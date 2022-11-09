import type { NextPage, NextPageContext } from 'next';
import { detailApi } from '../../../api/fetchApi';
import { Details as DetailsType } from '../../../types/Details';
import DetailsPageContainer from '../../../components/containers/deteils-page/DetailsPageContainer';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

interface Props {
  details: DetailsType.RootObject;
  mediaType: string;
  locale: string;
}

const Details: NextPage<Props> = ({ details, mediaType, locale }) => {
  const title = details.original_title || details.title || details.name;
  const router = useRouter();
  return (
    <>
      <NextSeo
        title={title}
        description={details.overview || details.biography}
        openGraph={{ url: `https://movie-tracker.dapzer.ru${router.asPath}` }}
      />
      <DetailsPageContainer details={details} mediaType={mediaType} locale={locale} />
    </>
  );
};

export default Details;

export async function getServerSideProps({ query, locale }: NextPageContext) {
  const data = await detailApi({ queryKey: ['getDetails', { mediaType: query.mediaType, mediaId: query.id, language: locale }] });

  return {
    props: { details: data, mediaType: query.mediaType, locale },
  };
}
