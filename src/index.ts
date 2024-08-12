import { Strapi } from "@strapi/strapi";
import { sdk } from "../open-telemetry/instrumentation";

export default {
  register({ strapi }: { strapi: Strapi }) {
    sdk.start();
  },

  bootstrap(/*{ strapi }*/) {},
};
