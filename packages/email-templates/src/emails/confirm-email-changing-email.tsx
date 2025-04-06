import type { StylesType } from "../types/StylesType"
import React from "react"
import { Button } from "../components/Button"
import { Typography } from "../components/Typography"
import { Wrapper } from "../components/Wrapper"

interface ConfirmEmailChangingEmailProps {
  url: string
  username: string
  email: string
}

const styles = {
  title: {
    marginBottom: "4px",
  },
  description: {
    marginBottom: "16px",
  },
} satisfies StylesType

export function ConfirmEmailChangingEmail(props: ConfirmEmailChangingEmailProps) {
  const { url, username, email } = props

  return (
    <Wrapper>
      <Typography variant="title" style={styles.title}>
        You’ve request email changing for
        {" "}
        {username}
        {" "}
        with email
        {" "}
        {email}
        {" "}
        at Movie Tracker.
      </Typography>
      <Typography
        style={styles.description}
      >
        Click on the button below to confirm email changing.
      </Typography>

      <Button href={url} target="_blank">
        Confirm email changing
      </Button>
    </Wrapper>
  )
}
