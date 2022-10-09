import React, { FC, useEffect, useState } from 'react';
import Search from '../../home-page/search/Search';

const HomePageContainer: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className={`container`}>
      <h2>Добро пожаловать на сайт по отслеживанию кинокартин!</h2>
      <Search setSearchTerm={setSearchTerm} />
    </div>
  );
};

export default HomePageContainer;
