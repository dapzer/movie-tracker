import * as process from "node:process"
import { Logger } from "@nestjs/common"
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { registerInstrumentations } from "@opentelemetry/instrumentation"
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core"
import { RedisInstrumentation } from "@opentelemetry/instrumentation-redis"
import { RuntimeNodeInstrumentation } from "@opentelemetry/instrumentation-runtime-node"
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base"
import { Resource } from "@opentelemetry/resources"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node"
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions"
import { PrismaInstrumentation } from "@prisma/instrumentation"

const logger = new Logger("OpenTelemetry")

if (process.env.UPTRACE_DSN) {
  try {
    const provider = new NodeTracerProvider({
      resource: new Resource({
        [ATTR_SERVICE_NAME]: process.env.NODE_ENV === "production" ? "api" : "api-dev",
      }),
      spanProcessors: [
        new BatchSpanProcessor(new OTLPTraceExporter({
          url: `${process.env.UPTRACE_HOST}/v1/traces`,
          headers: { "uptrace-dsn": process.env.UPTRACE_DSN },
          compression: CompressionAlgorithm.GZIP,
        })),
      ],
    })

    registerInstrumentations({
      tracerProvider: provider,
      instrumentations: [
        ...getNodeAutoInstrumentations(),
        new RuntimeNodeInstrumentation({
          monitoringPrecision: 5000,
        }),
        new NestInstrumentation({
          enabled: true,
        }),
        new PrismaInstrumentation({
          enabled: true,
        }),
        new RedisInstrumentation({
          enabled: true,
        }),
      ],
    })

    provider.register()

    logger.log("OpenTelemetry initialized successfully with Uptrace")
  }
  catch (error) {
    logger.error("Failed to initialize OpenTelemetry", error)
  }
}
