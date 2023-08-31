import React, { FC } from 'react';
import { UiInfoHeader } from '@/components/ui/imfo-header/UiInfoHeader';
import { Person } from '@/types/Person';
import { arrayToString } from '@/utils/arrayToString';
import useTranslation from 'next-translate/useTranslation';
import { Typography } from '@/components/ui/typography/UiTypography';

interface Props {
  details: Person.RootObject;
}

export const PersonDetailsHeader: FC<Props> = ({ details }) => {
  const { t, lang } = useTranslation('details');

  return (
    <UiInfoHeader original_title={details.name} title={details.name} image={details.profile_path}>
      <li>
        {t('person_details.birthday')}{' '}
        <Typography as="span" variant="listItem">
          {new Date(details.birthday).toLocaleDateString(lang)}
        </Typography>
      </li>
      {details.deathday && (
        <li>
          {t('person_details.deathday')}{' '}
          <Typography as="span" variant="listItem">
            {new Date(details.deathday).toLocaleDateString(lang)}
          </Typography>
        </li>
      )}
      {details.place_of_birth && (
        <li>
          {t('person_details.place_of_birth')}{' '}
          <Typography as="span" variant="listItem">
            {details.place_of_birth}
          </Typography>
        </li>
      )}
      {details.known_for_department && (
        <li>
          {t('person_details.fame_for')}{' '}
          <Typography as="span" variant="listItem">
            {details.known_for_department}
          </Typography>
        </li>
      )}
      {!!details.also_known_as.length && (
        <li>
          {t('person_details.also_known_as')}{' '}
          <Typography as="span" variant="listItem">
            {arrayToString(details.also_known_as)}
          </Typography>
        </li>
      )}
    </UiInfoHeader>
  );
};
