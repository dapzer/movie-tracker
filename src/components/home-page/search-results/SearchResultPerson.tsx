import React, { FC } from 'react';
import { SearchResponse } from '../../../types/SearchResponse';
import UiCard from '../../ui/card/UiCard';
import PersonModal from '../../core/person-details/PersonModal';

interface Props {
  personData: SearchResponse.ResultItem;
}

const SearchResultPerson: FC<Props> = ({ personData }) => {
  return (
    <UiCard title={personData.name} image={personData.profile_path}>
      <PersonModal personData={personData} />
    </UiCard>
  );
};

export default SearchResultPerson;
