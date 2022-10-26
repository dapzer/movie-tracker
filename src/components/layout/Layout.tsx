import React, { FC, useEffect } from 'react';
import Header from './header/Header';
import { useFavorite } from '../../hooks/useFavorite';
import { useSession } from 'next-auth/react';

interface Props {
  children: React.ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const { data: session } = useSession();

  const { getFavoriteList } = useFavorite();

  useEffect(() => {
    if (session?.user?.id) {
      getFavoriteList(session?.user?.id);
    }
  }, [session]);

  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
