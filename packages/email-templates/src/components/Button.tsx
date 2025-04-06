import type { ButtonProps as ButtonPropsType } from "@react-email/button"
import type { StylesType } from "../types/StylesType"
import { Button as UiButton } from "@react-email/button"
import React from "react"

interface ButtonProps extends ButtonPropsType {
  children: React.ReactNode
}

const styles = {
  button: {
    backgroundColor: "#1f242d",
    color: "#fff",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "16px",
    fontWeight: "600",
    fontFamily: "Inter",
    cursor: "pointer",
    textDecoration: "none",
  },
} satisfies StylesType

export function Button(props: ButtonProps) {
  const { children, style, ...rest } = props

  return (
    <UiButton style={{ ...styles.button, ...style }} {...rest}>
      {children}
    </UiButton>
  )
}
