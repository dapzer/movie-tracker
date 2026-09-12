import { Logger } from "@nestjs/common"
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { registerInstrumentations } from "@opentelemetry/instrumentation"
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core"
import { RedisInstrumentation } from "@opentelemetry/instrumentation-redis"
import { RuntimeNodeInstrumentation } from "@opentelemetry/instrumentation-runtime-node"
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node"
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions"
import { config } from "@/shared/constants"

const logger = new Logger("OpenTelemetry")

if (config.OTELCOL_URL) {
  try {
    const provider = new NodeTracerProvider({
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: config.NODE_ENV === "production" ? "api" : "api-dev",
      }),
      spanProcessors: [
        new BatchSpanProcessor(new OTLPTraceExporter({
          url: `${config.OTELCOL_URL}/v1/traces`,
          compression: CompressionAlgorithm.GZIP,
        })),
      ],
    })

    provider.register()

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
        new RedisInstrumentation({
          enabled: true,
        }),
      ],
    })

    logger.log("OpenTelemetry initialized successfully")
  }
  catch (error) {
    logger.error("Failed to initialize OpenTelemetry", error)
  }
}
