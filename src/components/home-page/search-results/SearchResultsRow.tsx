import React, { FC } from 'react';
import { SearchResponse } from '../../../types/SearchResponse';
import SearchResultsItem from './SearchResultsItem';
import styles from './search-results.module.scss';
import Masonry from 'react-masonry-css';

interface Props {
  searchResponse?: SearchResponse;
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const SearchResultsRow: FC<Props> = ({ searchResponse }) => {
  return (
    <div className={styles.result}>
      {searchResponse && <h3>Найдено результатов: {searchResponse?.total_results}</h3>}

      <div className={styles.resultItems}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="searching-results-masonry__row"
          columnClassName="searching-results-masonry__row-column"
        >
          {searchResponse &&
            searchResponse.results.map((item, index) => (
              <SearchResultsItem key={item.id} item={item} />
            ))}
        </Masonry>
      </div>
    </div>
  );
};

export default SearchResultsRow;
