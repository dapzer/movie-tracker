import React, { FC, useEffect } from 'react';
import { Header } from './header/Header';
import { useSession } from 'next-auth/react';
import { Footer } from './footer/Footer';
import { useAppDispatch } from '@/redux/hooks';
import { fetchFavoriteListApi } from '@/redux/features/favoriteList/favoriteListThunk';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = (props: LayoutProps) => {
  const { children } = props;
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(fetchFavoriteListApi(session.user.id));
    }
  }, [session]);

  return (
    <div className={'layout'}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
