import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import SEO from '../../next-seo.config';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DefaultSeo } from 'next-seo';
import NextNProgress from 'nextjs-progressbar';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from '@vercel/analytics/react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import useTranslation from 'next-translate/useTranslation';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
  const [queryClient] = useState(() => new QueryClient());
  const { t, lang } = useTranslation('pagesSeo');

  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <SkeletonTheme baseColor='#282f43' highlightColor='#4F5D75' duration={2}>
            <Layout>
              <DefaultSeo {...SEO} description={t('defaultDescription')}
                          openGraph={{ description: t('defaultDescription'), locale: lang }} />
              <NextNProgress startPosition={0.3} stopDelayMs={100} height={3} color='#0073fa' />
              <ToastContainer theme={'dark'} autoClose={1500} limit={2} />
              <Component {...pageProps} />
              <Analytics />
            </Layout>
          </SkeletonTheme>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </Provider>
  );
}

export default MyApp;
