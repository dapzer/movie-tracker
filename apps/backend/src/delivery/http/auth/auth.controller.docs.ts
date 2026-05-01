import { applyDecorators } from "@nestjs/common"
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function AuthControllerDocs() {
  return applyDecorators(
    ApiTags("Auth"),
  )
}

export function SignUpDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Sign up user" }),
    ApiOkResponse({ description: "User created and session started" }),
    ApiInternalServerErrorResponse({ description: "Failed to sign up", type: ErrorResponseDto }),
  )
}

export function SignInDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Sign in user" }),
    ApiOkResponse({ description: "User authenticated" }),
    ApiUnauthorizedResponse({ description: "Invalid credentials or already authenticated", type: ErrorResponseDto }),
  )
}

export function RecoverPasswordDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Send password recovery email" }),
    ApiOkResponse({ description: "Recovery email sent" }),
    ApiTooManyRequestsResponse({ description: "Too many requests", type: ErrorResponseDto }),
  )
}

export function ResetPasswordDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Reset password by token" }),
    ApiOkResponse({ description: "Password reset and session updated" }),
    ApiUnauthorizedResponse({ description: "Invalid token", type: ErrorResponseDto }),
  )
}

export function RequestChangeEmailDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Request email change" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Confirmation email sent" }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiTooManyRequestsResponse({ description: "Too many requests", type: ErrorResponseDto }),
  )
}

export function ConfirmChangeEmailDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Confirm email change" }),
    ApiSecurity("oauth2"),
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
