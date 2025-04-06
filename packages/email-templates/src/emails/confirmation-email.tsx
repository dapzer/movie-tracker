import type { StylesType } from "../types/StylesType"
import React from "react"
import { Button } from "../components/Button"
import { Typography } from "../components/Typography"
import { Wrapper } from "../components/Wrapper"

interface ConfirmationEmailProps {
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

export function ConfirmationEmail(props: ConfirmationEmailProps) {
  const { url, username } = props

  return (
    <Wrapper>
      <Typography variant="title" style={styles.title}>
        You’ve request email confirmation for
        {" "}
        {username}
        {" "}
        at Movie Tracker.
      </Typography>
      <Typography
        style={styles.description}
      >
        Click on the button below to confirm your mail.
      </Typography>

      <Button href={url} target="_blank">
        Confirm email
      </Button>
    </Wrapper>
  )
}

export default ConfirmationEmail
