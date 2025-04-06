import type { StylesType } from "../types/StylesType"
import React from "react"
import { Button } from "../components/Button"
import { Typography } from "../components/Typography"
import { Wrapper } from "../components/Wrapper"

interface PasswordRecoveryEmailProps {
  url: string
}

const styles = {
  title: {
    marginBottom: "4px",
  },
  description: {
    marginBottom: "16px",
  },
} satisfies StylesType

export function PasswordRecoveryEmail(props: PasswordRecoveryEmailProps) {
  const { url } = props

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
  )
}

export default PasswordRecoveryEmail
