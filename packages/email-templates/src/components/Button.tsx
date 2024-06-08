import React from 'react';
import { StylesType } from '../types/StylesType';
import { ButtonProps as ButtonPropsType, Button as UiButton } from '@react-email/button';

interface ButtonProps extends ButtonPropsType{
  children: React.ReactNode;
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
    textDecoration: "none"
  }
} satisfies StylesType;

export const Button = (props: ButtonProps) => {
  const { children, style, ...rest } = props;

  return (
    <UiButton style={{...styles.button, ...style}} {...rest}>
      {children}
    </UiButton>
  );
};
