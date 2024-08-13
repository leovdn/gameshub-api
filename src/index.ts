import { Strapi } from "@strapi/strapi";
import { sdk } from "../open-telemetry/instrumentation";
import { metrics, Span, trace } from "@opentelemetry/api";

export default {
  register({ strapi }: { strapi: Strapi }) {
    sdk.start();
  },

  bootstrap(/*{ strapi }*/) {
    const tracer = trace.getTracer("strapi-gamehub");
    metrics.getMeter("strapi-gamehub");

    return tracer.startActiveSpan("bootstrap", (span: Span) => {
      span.end();
    });
  },
};
