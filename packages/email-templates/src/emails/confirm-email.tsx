import { Body, Button, Container, Img, Head, Hr, Html, Section, Text } from "@react-email/components";
import React from "react";

interface ConfirmEmailProps {
  url: string;
  username: string;
}

const styles = {
  body: {
    backgroundColor: "#efeef1",
    padding: "24px 48px"
  },
  container: {
    maxWidth: "580px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "24px"
  },
  logo: {
    margin: "16px auto",
  },
  welcomeText: {
    fontSize: "20px",
    fontWeight: "600",
    fontFamily: "Inter",
    color: "#1f242d",
    marginBottom: "4px"
  },
  welcomeDescription: {
    fontSize: "16px",
    fontWeight: "400",
    fontFamily: "Inter",
    color: "#1f242d",
    marginTop: "0"
  },
  button: {
    backgroundColor: "#1f242d",
    color: "#fff",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "16px",
    fontWeight: "600",
    fontFamily: "Inter",
    cursor: "pointer",
    textDecoration: "none"
  }
} satisfies Record<string, React.CSSProperties>;

export const ConfirmEmail = (props: ConfirmEmailProps) => {
  const { url, username } = props;

  return (
    <Html>
      <Head />

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section>
            <Img style={styles.logo} src="https://storage.yandexcloud.net/movie-tracker-static/assets/MovieTrackerMailLogo.jpg"/>
          </Section>
          <Hr />
          <Section>
            <Text style={styles.welcomeText}>
              Welcome! You’ve signed up as {username} at Movie Tracker.
            </Text>
            <Text
              style={styles.welcomeDescription}
            >
              Please confirm your email by clicking on the button below.
            </Text>

            <Button style={styles.button} href={url} target="_blank">
              Confirm email
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ConfirmEmail;
