import React, { FC } from 'react';
import UiModal from '../../ui/modal/UiModal';
import PersonDetails from './PersonDetails';
import { SearchResponse } from '../../../types/SearchResponse';
import { Person } from '../../../types/Person';
import { Credits } from '../../../types/Credits';

interface Props {
  personData: SearchResponse.ResultItem | Person.Cast | Credits.Cast;
}

const PersonModal: FC<Props> = ({ personData }) => {
  return (
    <UiModal title={'Информация о актёре'} fullWidth>
      <PersonDetails personData={personData} />
    </UiModal>
  );
};

export default PersonModal;
