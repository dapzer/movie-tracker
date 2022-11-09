import React, { FC } from 'react';
import { Person } from '../../../types/Person';
import Details from '../../../components/core/details/Details';
import { Details as DetailsType } from '../../../types/Details';
import { ContentNames } from '../../../types/ContentNames';
import PersonDetails from '../../core/person-details/PersonDetails';
import useTranslation from 'next-translate/useTranslation';
import styles from './details.module.scss';
import BackBtn from '../../core/back-btn/BackBtn';

interface Props {
  details: Person.RootObject | DetailsType.RootObject;
  mediaType: string;
  locale: string;
}

const DetailsPageContainer: FC<Props> = ({ mediaType, locale, details }) => {
  const { t } = useTranslation('card');

  return (
    <div className={`container ${styles['details']}`}>
      <BackBtn />

      <h2 className={styles['details__title']}>{t(`about_${mediaType}`)}</h2>

      {mediaType === ContentNames.Person ? (
        <PersonDetails initialData={details as Person.RootObject} personId={details.id} />
      ) : (
        <Details initialData={details as DetailsType.RootObject} mediaType={mediaType} mediaId={details.id} />
      )}
    </div>
  );
};

export default DetailsPageContainer;
