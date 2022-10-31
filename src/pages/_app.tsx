import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';
import { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { FavoriteContextProvider } from '../context/FavoriteContext';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <FavoriteContextProvider>
          <Layout>
            <SkeletonTheme baseColor="#282f43" highlightColor="#4F5D75" duration={2}>
              <Component {...pageProps} />
            </SkeletonTheme>
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </FavoriteContextProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
