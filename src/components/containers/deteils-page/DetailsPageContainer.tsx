import React, { FC } from 'react';
import { Person } from '../../../types/Person';
import Details from '../../../components/core/details/Details';
import { Details as DetailsType } from '../../../types/Details';
import { ContentNames } from '../../../types/ContentNames';
import PersonDetails from '../../core/person-details/PersonDetails';
import styles from './details.module.scss';
import BackBtn from '../../core/back-btn/BackBtn';

interface Props {
  details: Person.RootObject | DetailsType.RootObject;
  mediaType: string;
  locale: string;
}

const DetailsPageContainer: FC<Props> = ({ mediaType, locale, details }) => {
  return (
    <div className={`container ${styles['details']}`}>
      <BackBtn />

      {mediaType === ContentNames.Person ? (
        <PersonDetails initialData={details as Person.RootObject} personId={details.id} />
      ) : (
        <Details initialData={details as DetailsType.RootObject} mediaType={mediaType} mediaId={details.id} />
      )}
    </div>
  );
};

export default DetailsPageContainer;
