import React, { FC } from 'react';
import { Credits } from '@/types/Credits';
import { Details } from '@/types/Details';
import Link from 'next/link';

interface Props {
  producers: Credits.Cast[] | Details.CreatedBy[];
}

const MovieDetailsProducers: FC<Props> = (props) => {
  return (
    <>
      {props.producers.map((el, index) => (
        <React.Fragment key={index} >
          <Link href={`/details/person/${el.id}`}>
            {el.name}
          </Link>
          {props.producers.length - 1 !== index && ', '}
        </React.Fragment>
      ))}
    </>
  );
};

export default MovieDetailsProducers;
