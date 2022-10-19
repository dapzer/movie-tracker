import React, { FC } from 'react';
import { SearchResponse } from '../../../types/SearchResponse';
import SearchResultMovie from './SearchResultMovie';
import styles from './search-results.module.scss';
import Masonry from 'react-masonry-css';
import DetailsModal from '../../core/details-modal/DetailsModal';
import { ContentNames } from '../../../types/ContentNames';

interface Props {
  searchResponse?: SearchResponse.RootObject;
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const SearchResultsRow: FC<Props> = ({ searchResponse }) => {
  return (
    <div className={styles['result']}>
      {searchResponse && <h3>Найдено результатов: {searchResponse?.total_results}</h3>}
      <DetailsModal showId={597} showType={'movie'} />
      <DetailsModal showId={61222} showType={'tv'} />
      <DetailsModal showId={60625} showType={'tv'} />

      <div className={styles['result__items']}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="searching-results-masonry__row"
          columnClassName="searching-results-masonry__row-column"
        >
          {searchResponse &&
            searchResponse.results.map((item, index) => {
              if (item.media_type !== ContentNames.Person) {
                return <SearchResultMovie key={item.id} item={item} />;
              }
            })}
        </Masonry>
      </div>
    </div>
  );
};

export default SearchResultsRow;
