import React, { FC } from 'react';
import UiModal from '../../../ui/modal/UiModal';
import PersonDetails from './PersonDetails';
import { SearchResponse } from '../../../../types/SearchResponse';
import { Person } from '../../../../types/Person';
import { Credits } from '../../../../types/Credits';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  personData: SearchResponse.ResultItem | Person.Cast | Credits.Cast;
}

const PersonModal: FC<Props> = ({ personData }) => {
  const { t } = useTranslation('card');

  return (
    <UiModal title={t('about_person')} fullWidth>
      <PersonDetails personId={personData.id} />
    </UiModal>
  );
};

export default PersonModal;
