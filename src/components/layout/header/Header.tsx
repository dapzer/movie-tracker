import React, { FC } from 'react';
import styles from "./header.module.scss"
import Link from 'next/link'

const Header: FC = () => {
  return (
    <div className={styles.header}>
      <div className={`${styles.headerContent} container`}>
        <Link href="/">
          <h3 className={styles.logo}>Movie Tracker</h3>
        </Link>

        <nav className={styles.linksList}>
          <Link href="/">
            <a>Поиск</a>
          </Link>
          <Link href="/myList">
            <a>Мой список</a>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;
