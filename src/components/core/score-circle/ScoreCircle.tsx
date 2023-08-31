import React, { FC } from 'react';
import styles from './score-circle.module.scss';
import { Typography } from '@/components/ui/typography/UiTypography';

interface Props {
  value: number;
}

const scoreRanges = [
  {
    color: '#ff4545',
    min: 0,
    max: 3,
  },
  {
    color: '#ffa534',
    min: 3,
    max: 6,
  },
  {
    color: '#b7dd29',
    min: 6,
    max: 9,
  },
  {
    color: '#57e32c',
    min: 9,
    max: 10,
  },
];

export const ScoreCircle: FC<Props> = ({ value }) => {
  const indicatorColor = (score: number) => {
    for (let range of scoreRanges) {
      if (range.min <= score && score <= range.max) {
        return range.color;
      }
    }
  };

  return (
    <div className={styles['container']}>
      <div
        className={styles['indicator']}
        style={
          {
            '--progress': `${3.6 * (value * 10)}deg`,
            '--progressColor': indicatorColor(value),
          } as React.CSSProperties
        }
      >
        <Typography as="span" variant="textSmall">
          {value}
        </Typography>
      </div>
    </div>
  );
};
