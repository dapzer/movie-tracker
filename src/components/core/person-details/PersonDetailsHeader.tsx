import React, { FC } from 'react';
import UiInfoHeader from '../../ui/imfo-header/UiInfoHeader';
import { Person } from '../../../types/Person';
import { arrayToString } from '../../../utils/arrayToString.helper';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  details: Person.RootObject;
}

const PersonDetailsHeader: FC<Props> = ({ details }) => {
  const { t } = useTranslation('details');

  return (
    <UiInfoHeader original_title={details.name} title={details.name} image={details.profile_path}>
      <li>
        {t('person_details.birthday')} <span>{new Date(details.birthday).toLocaleDateString()}</span>
      </li>
      {details.deathday && (
        <li>
          {t('person_details.deathday')} <span>{new Date(details.deathday).toLocaleDateString()}</span>
        </li>
      )}
      <li>
        {t('person_details.fame_for')} <span>{details.known_for_department}</span>
      </li>
      <li>
        {t('person_details.also_known_as')} <span>{arrayToString(details.also_known_as)}</span>
      </li>
    </UiInfoHeader>
  );
};

export default PersonDetailsHeader;