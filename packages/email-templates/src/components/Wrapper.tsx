import React from 'react';
import { Body, Container, Head, Hr, Html, Img, Link, Section } from '@react-email/components';
import { StylesType } from '../types/StylesType';
import { Typography } from './Typography';

interface WrapperProps {
  children: React.ReactNode;
}

const styles = {
  body: {
    backgroundColor: '#efeef1',
    padding: '24px 12px',
  },
  container: {
    maxWidth: '580px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
  },
  logo: {
    margin: '16px auto',
    maxWidth: '245px',
    width: '100%',
  },
  line: {
    marginBottom: '16px',
  },
  regards: {
    textAlign: 'center',
    marginTop: '16px',
  },
  link: {
    color: 'inherit',
    textDecoration: 'underline',
  },
} satisfies StylesType;


export const Wrapper = (props: WrapperProps) => {
  const { children } = props;

  return (
    <Html>
      <Head />

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section>
            <Img style={styles.logo}
                 src="https://storage.yandexcloud.net/movie-tracker-static/assets/MovieTrackerMailLogo.jpg"
            />
          </Section>

          <Hr style={styles.line} />

          <Section>
            {children}
          </Section
          >
          <Section>
            <Typography style={styles.regards} variant="description">
              Regards, <Link style={styles.link} href="https://movie-tracker.app">movie-tracker.app</Link>
            </Typography>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
