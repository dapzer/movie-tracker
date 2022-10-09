import React, { FC } from 'react';
import Header from "./header/Header";

interface Props {
  children: React.ReactNode
}

const Layout: FC<Props> = ({children}) => {
  return (
    <div>
      <Header/>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
