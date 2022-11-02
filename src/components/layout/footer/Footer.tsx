import React, { FC } from 'react';
import styles from './footer.module.scss';

interface Props {}

const contacts = [
  {
    title: 'GitHub:',
    value: 'dapzer',
    link: 'https://github.com/dapzer',
  },
  {
    title: 'Telegram:',
    value: '@dapzer',
    link: 'https://t.me/dapzer',
  },
  {
    title: 'Email:',
    value: 'danila.webdev@gmail.com',
    link: 'mailto:danila.webdev@gmail.com',
  },
];

const Footer: FC<Props> = () => {
  return (
    <footer className={styles['footer']}>
      <div className={'container'}>
        <ul>
          <li>
            Created by: <span>Danila Voronkov</span>
          </li>
          {contacts.map((el, index) => (
            <li key={`footer-link-${index}`}>
              {el.title}{' '}
              <span>
                <a href={el.link} target="_blank">
                  {el.value}
                </a>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
