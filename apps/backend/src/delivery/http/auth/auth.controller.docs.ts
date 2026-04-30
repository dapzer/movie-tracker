import { applyDecorators } from "@nestjs/common"
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { ConfirmChangeEmailDto } from "@/services/auth/dto/confirmChangeEmail.dto"
import { ConfirmEmailDto } from "@/services/auth/dto/confirmEmail.dto"
import { GetRecoverPasswordEmailDto } from "@/services/auth/dto/getRecoverPasswordEmail.dto"
import { RequestChangeEmailDto } from "@/services/auth/dto/requestChangeEmail.dto"
import { ResetPasswordByTokenDto } from "@/services/auth/dto/resetPasswordByToken.dto"
import { SignInDto } from "@/services/auth/dto/signIn.dto"
import { SignUpDto } from "@/services/auth/dto/signUp.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function AuthControllerDocs() {
  return applyDecorators(
    ApiTags("Auth"),
  )
}

export function SignUpDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Sign up user" }),
    ApiBody({ type: SignUpDto }),
    ApiOkResponse({ description: "User created and session started" }),
    ApiInternalServerErrorResponse({ description: "Failed to sign up", type: ErrorResponseDto }),
  )
}

export function SignInDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Sign in user" }),
    ApiBody({ type: SignInDto }),
    ApiOkResponse({ description: "User authenticated" }),
    ApiUnauthorizedResponse({ description: "Invalid credentials or already authenticated", type: ErrorResponseDto }),
  )
}

export function RecoverPasswordDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Send password recovery email" }),
    ApiBody({ type: GetRecoverPasswordEmailDto }),
    ApiOkResponse({ description: "Recovery email sent" }),
    ApiTooManyRequestsResponse({ description: "Too many requests", type: ErrorResponseDto }),
  )
}

export function ResetPasswordDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Reset password by token" }),
    ApiBody({ type: ResetPasswordByTokenDto }),
    ApiOkResponse({ description: "Password reset and session updated" }),
    ApiUnauthorizedResponse({ description: "Invalid token", type: ErrorResponseDto }),
  )
}

export function RequestChangeEmailDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Request email change" }),
    ApiSecurity("oauth2"),
    ApiBody({ type: RequestChangeEmailDto }),
    ApiOkResponse({ description: "Confirmation email sent" }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiTooManyRequestsResponse({ description: "Too many requests", type: ErrorResponseDto }),
  )
}

export function ConfirmChangeEmailDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Confirm email change" }),
    ApiSecurity("oauth2"),
    ApiBody({ type: ConfirmChangeEmailDto }),
    ApiOkResponse({ description: "Email updated" }),
    ApiUnauthorizedResponse({ description: "Unauthorized or invalid token", type: ErrorResponseDto }),
  )
}

export function SendConfirmEmailDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Send email confirmation" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Confirmation email sent" }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiTooManyRequestsResponse({ description: "Too many requests", type: ErrorResponseDto }),
  )
}

export function ConfirmEmailDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Confirm email with token" }),
    ApiSecurity("oauth2"),
    ApiBody({ type: ConfirmEmailDto }),
    ApiOkResponse({ description: "Email confirmed" }),
    ApiUnauthorizedResponse({ description: "Invalid token", type: ErrorResponseDto }),
  )
}

export function OAuthCallbackDocs() {
  return applyDecorators(
    ApiOperation({ summary: "OAuth callback" }),
    ApiOkResponse({ description: "User authenticated via provider" }),
    ApiUnauthorizedResponse({ description: "Invalid provider or code", type: ErrorResponseDto }),
  )
}

export function OAuthConnectDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get OAuth provider URL" }),
    ApiOkResponse({
      description: "Provider auth URL",
      schema: { type: "string", example: { url: "https://provider.com/oauth" } },
    }),
  )
}

export function LogoutDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Logout user" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Session destroyed" }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to logout", type: ErrorResponseDto }),
  )
}
