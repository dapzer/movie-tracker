import { INestApplication } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { apiReference } from "@scalar/nestjs-api-reference"

export function setupOpenApi(app: INestApplication, configService: ConfigService) {
  if (configService.getOrThrow("NODE_ENV") !== "development") {
    return
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Movie Tracker API")
    .setDescription("Movie Tracker API documentation")
    .setVersion("1.0")
    .addOAuth2(
      {
        type: "oauth2",
        flows: {
          authorizationCode: {
            authorizationUrl: "https://github.com/login/oauth/authorize",
            tokenUrl: "https://github.com/login/oauth/access_token",
            scopes: {
              "read:user": "read user info",
              "user:email": "read user email",
            },
          },
        },
      },
      "oauth2",
    )
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  const jsonUrl = "/api/openapi/json"

  SwaggerModule.setup("/api/openapi", app, swaggerDocument, {
    jsonDocumentUrl: jsonUrl,
    ui: false,
  })

  const env = configService.get("NODE_ENV")
  const githubClientId = env === "development" ? configService.get("GITHUB_CLIENT_ID") : ""
  const githubClientSecret = env === "development" ? configService.get("GITHUB_CLIENT_SECRET") : ""
  const githubRedirectUri = `${configService.get("CLIENT_BASE_URL")}/auth/callback/github`

  app.use(
    "/api/docs",
    apiReference({
      url: jsonUrl,
      theme: "deepSpace",
      authentication: {
        preferredSecurityScheme: "oauth2",
        securitySchemes: {
          oauth2: {
            flows: {
              authorizationCode: {
                "x-scalar-client-id": githubClientId,
                "clientSecret": githubClientSecret,
                "x-scalar-redirect-uri": githubRedirectUri,
                "x-usePkce": "no",
                "selectedScopes": ["read:user", "user:email"],
              },
            },
          },
        },
      },
    }),
  )
}
