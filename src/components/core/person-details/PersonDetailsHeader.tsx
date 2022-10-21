import React, { FC } from 'react';
import UiInfoHeader from '../../ui/imfo-header/UiInfoHeader';
import { Person } from '../../../types/Person';
import { arrayToString } from '../../../utils/arrayToString.helper';

interface Props {
  details: Person.RootObject;
}

const PersonDetailsHeader: FC<Props> = ({ details }) => {
  return (
    <div>
      <UiInfoHeader original_title={details.name} title={details.name} image={details.profile_path}>
        <li>
          День рождения: <span>{new Date(details.birthday).toLocaleDateString()}</span>
        </li>
        {details.deathday && (
          <li>
            Дата смерти: <span>{new Date(details.deathday).toLocaleDateString()}</span>
          </li>
        )}
        <li>
          Известность за: <span>{details.known_for_department}</span>
        </li>
        <li>
          Также известен как: <span>{arrayToString(details.also_known_as)}</span>
        </li>
      </UiInfoHeader>
    </div>
  );
};

export default PersonDetailsHeader;
