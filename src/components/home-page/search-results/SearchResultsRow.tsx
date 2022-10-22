import React, { FC } from 'react';
import { SearchResponse } from '../../../types/SearchResponse';
import SearchResultMovie from './SearchResultMovie';
import styles from './search-results.module.scss';
import Masonry from 'react-masonry-css';
import { ContentNames } from '../../../types/ContentNames';
import SearchResultPerson from './SearchResultPerson';
import DetailsModal from '../../core/details/DetailsModal';
import useTranslation from 'next-translate/useTranslation';

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
  const { t } = useTranslation('searchPage');

  return (
    <div className={styles['result']}>
      {searchResponse && (
        <h3>
          {t('search_totalResults')} {searchResponse?.total_results}
        </h3>
      )}
      <DetailsModal mediaId={597} mediaType={'movie'} />
      <DetailsModal mediaId={61222} mediaType={'tv'} />
      <DetailsModal mediaId={60625} mediaType={'tv'} />

      <div className={styles['result__items']}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="searching-results-masonry__row"
          columnClassName="searching-results-masonry__row-column"
        >
          {searchResponse &&
            searchResponse.results.map((item, index) =>
              item.media_type === ContentNames.Person ? (
                <SearchResultPerson key={item.id} personData={item} />
              ) : (
                <SearchResultMovie key={item.id} item={item} />
              )
            )}
        </Masonry>
      </div>
    </div>
  );
};

export default SearchResultsRow;
