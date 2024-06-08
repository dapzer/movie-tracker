import { Wrapper } from '../components/Wrapper';
import { StylesType } from '../types/StylesType';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import React from 'react';

interface PasswordRecoveryEmailProps {
  url: string;
}

const styles = {
  title: {
    marginBottom: '4px',
  },
  description: {
    marginBottom: '16px',
  },
} satisfies StylesType;


export const PasswordRecoveryEmail = (props: PasswordRecoveryEmailProps) => {
  const { url } = props;

  return (
    <Wrapper>
      <Typography variant="title" style={styles.title}>
        You have sent a password recovery request at Movie Tracker.
      </Typography>

      <Typography
        style={styles.description}
      >
        Click on the button below to recover your password.
      </Typography>

      <Button href={url} style={styles.title} target="_blank">
        Recover password
      </Button>

      <Typography
        variant="description"
      >
        If you have not requested a password reset, ignore this message!.
      </Typography>
    </Wrapper>
  );
};

export default PasswordRecoveryEmail;
