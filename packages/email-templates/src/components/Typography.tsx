import type { TextProps } from "@react-email/text"
import type { StylesType } from "../types/StylesType"
import { Text } from "@react-email/components"

const styles = {
  title: {
    fontSize: "20px",
    fontWeight: "600",
    fontFamily: "Inter",
    color: "#1f242d",
    margin: "unset",
  },
  text: {
    fontSize: "16px",
    fontWeight: "400",
    fontFamily: "Inter",
    color: "#1f242d",
    margin: "unset",
  },
  description: {
    fontSize: "14px",
    fontWeight: "400",
    fontFamily: "Inter",
    color: "#1f242d",
    margin: "unset",
    opacity: 0.7,
  },
} satisfies StylesType

interface TypographyProps extends TextProps {
  variant?: keyof typeof styles
}

export function Typography(props: TypographyProps) {
  const { style = {}, variant = "text", ...rest } = props

  return (
    <Text
      style={{
        ...styles[variant],
        ...style,
      }}
      {...rest}
    />
  )
}
