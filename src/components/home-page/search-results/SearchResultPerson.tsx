import React, { FC } from 'react';
import { SearchResponse } from '../../../types/SearchResponse';
import UiCard from '../../ui/card/UiCard';
import { ContentNames } from '../../../types/ContentNames';
import LinkToDetails from '../../core/details/link-to-details/LinkToDetails';

interface Props {
  personData: SearchResponse.ResultItem;
}

const SearchResultPerson: FC<Props> = ({ personData }) => {
  return (
    <UiCard link={`details/${ContentNames.Person}/${personData.id}`} title={personData.name} image={personData.profile_path}>
      <LinkToDetails mediaId={personData.id} mediaType={ContentNames.Person} />
    </UiCard>
  );
};

export default SearchResultPerson;
