import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { Resource } from "@opentelemetry/resources";
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";

export const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: "gamehub-api",
    [SEMRESATTRS_SERVICE_VERSION]: "0.7.0",
  }),
  traceExporter: new ZipkinExporter({}),

  metricReader: new PrometheusExporter({}),
  // metricReader: new PeriodicExportingMetricReader({
  //   exporter: new OTLPMetricExporter({
  //     url: "http://localhost:9190/api/v1/otlp",
  //     headers: {},
  //   }),
  // }),
  instrumentations: [getNodeAutoInstrumentations()],
});
