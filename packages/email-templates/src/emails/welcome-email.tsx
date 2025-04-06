import type { StylesType } from "../types/StylesType"
import React from "react"
import { Button } from "../components/Button"
import { Typography } from "../components/Typography"
import { Wrapper } from "../components/Wrapper"

interface WelcomeEmailProps {
  url: string
  username: string
}

const styles = {
  title: {
    marginBottom: "4px",
  },
  description: {
    marginBottom: "16px",
  },
} satisfies StylesType

export function WelcomeEmail(props: WelcomeEmailProps) {
  const { url, username } = props

  return (
    <Wrapper>
      <Typography variant="title" style={styles.title}>
        Welcome! You’ve signed up as
        {" "}
        {username}
        {" "}
        at Movie Tracker.
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
  )
}

export default WelcomeEmail
