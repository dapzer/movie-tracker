import { z } from "zod"

const zNumber = z
  .string()
  .transform((value) => {
    const parsedValue = Number.parseFloat(value)
    if (Number.isNaN(parsedValue)) {
      throw new TypeError(`Invalid number: ${value}`)
    }
    return parsedValue
  })

const zBoolean = z
  .string()
  .optional()
  .transform((value) => {
    if (value === "true") {
      return true
    }
    if (value === "false") {
      return false
    }
    throw new TypeError(`Invalid boolean: ${value}`)
  })

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  API_BASE_URL: z.string(),
  PORT: zNumber.default(1337),
  AUTH_REDIRECT_URL: z.string(),
  CLIENT_BASE_URL: z.string(),
  REDIS_URL: z.string(),
  OTELCOL_URL: z.string().optional(),

  GENERATE_SITEMAP: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  VK_CLIENT_ID: z.string(),
  VK_CLIENT_SECRET: z.string(),
  YANDEX_CLIENT_ID: z.string(),
  YANDEX_CLIENT_SECRET: z.string(),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_KEY: z.string().optional(),
  SUPPORT_EMAIL_ADDRESS: z.string().optional(),

  TMDB_API_URL: z.string(),
  TMDB_FILES_API_URL: z.string(),
  TMDB_IMAGE_API_URL: z.string(),
  TMDB_API_KEY: z.string(),

  AI_PROVIDER: z.enum(["opencode-go", "openrouter"]).default("opencode-go"),
  OPENCODE_GO_API_KEY: z.string().optional(),
  OPENCODE_GO_API_URL: z.string().url().default("https://opencode.ai/inference/go/openai/v1"),
  OPENCODE_GO_MODEL: z.string().default("deepseek-v4.1-flash"),
  OPENCODE_GO_TIMEOUT_MS: zNumber.default(60000),
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_API_URL: z.string().url().default("https://openrouter.ai/api/v1"),
  OPENROUTER_MODEL: z.string().default("openai/gpt-4o-mini"),
  OPENROUTER_TIMEOUT_MS: zNumber.default(60000),

  MEDIA_REVIEWS_MODERATION_REQUIRED: zBoolean.default(false),
})
