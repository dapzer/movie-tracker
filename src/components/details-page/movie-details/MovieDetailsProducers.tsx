import React, { FC } from 'react';
import { Credits } from '@/types/Credits';
import { Details } from '@/types/Details';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography/UiTypography';

interface Props {
  producers: Credits.Cast[] | Details.CreatedBy[];
}

export const MovieDetailsProducers: FC<Props> = (props) => {
  return (
    <>
      {props.producers.map((el, index) => (
        <React.Fragment key={index}>
          <Typography as={Link} variant="linkUnderlined" href={`/details/person/${el.id}`}>
            {el.name}
          </Typography>
          {props.producers.length - 1 !== index && ', '}
        </React.Fragment>
      ))}
    </>
  );
};
