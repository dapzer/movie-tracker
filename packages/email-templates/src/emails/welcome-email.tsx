import React from "react";
import { Wrapper } from '../components/Wrapper';
import { StylesType } from '../types/StylesType';
import { Button } from '../components/Button';
import { Typography } from '../components/Typography';

interface WelcomeEmailProps {
  url: string;
  username: string;
}

const styles = {
  title: {
    marginBottom: "4px"
  },
  description: {
    marginBottom: "16px"
  },
} satisfies StylesType;

export const WelcomeEmail = (props: WelcomeEmailProps) => {
  const { url, username } = props;

  return (
    <Wrapper>
      <Typography variant="title" style={styles.title}>
        Welcome! You’ve signed up as {username} at Movie Tracker.
      </Typography>
      <Typography
        style={styles.description}
      >
        Please confirm your email by clicking on the button below.
      </Typography>

      <Button href={url} target="_blank">
        Confirm email
      </Button>
    </Wrapper>
  );
};

export default WelcomeEmail;
