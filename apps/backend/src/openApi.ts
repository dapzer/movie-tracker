import { INestApplication } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { apiReference } from "@scalar/nestjs-api-reference"
import { cleanupOpenApiDoc } from "nestjs-zod"

export function setupOpenApi(app: INestApplication, configService: ConfigService) {
  const isDevelopment = configService.get("NODE_ENV") === "development"

  if (!isDevelopment) {
    return
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Movie Tracker API")
    .setDescription("Movie Tracker API documentation")
    .setVersion("1.0")
    .addCookieAuth("session", {
      type: "apiKey",
      in: "cookie",
      name: "session",
    })
    .build()

  const swaggerDocument = cleanupOpenApiDoc(SwaggerModule.createDocument(app, swaggerConfig))
  const jsonUrl = "/api/openapi/json"

  SwaggerModule.setup("/api/openapi", app, swaggerDocument, {
    jsonDocumentUrl: jsonUrl,
    ui: false,
  })

  app.use(
    "/api/docs",
    apiReference({
      url: jsonUrl,
      theme: "deepSpace",
      authentication: {
        preferredSecurityScheme: "cookie",
      },
    }),
  )
}
