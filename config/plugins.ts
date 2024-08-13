import { apolloPrometheusPlugin } from "strapi-prometheus";

export default () => ({
  "strapi-prometheus": {
    enabled: true,
    config: {
      // add prefix to all the prometheus metrics names.
      prefix: "",

      // use full url instead of matched url
      // true  => path label: `/api/models/1`
      // false => path label: `/api/models/:id`
      fullURL: false,

      // include url query in the url label
      // true  => path label: `/api/models?limit=1`
      // false => path label: `/api/models`
      includeQuery: false,

      // metrics that will be enabled, by default they are all enabled.
      enabledMetrics: {
        koa: true, // koa metrics
        process: true, // metrics regarding the running process
        http: true, // http metrics like response time and size
        apollo: true, // metrics regarding graphql
      },

      // interval at which rate metrics are collected in ms
      interval: 10_000,

      // set custom/default labels to all the prometheus metrics
      customLabels: {
        name: "strapi-prometheus",
      },

      // run metrics on seperate server / port
      server: {
        // when enabled metrics will run seperatly from the strapi instance. It will still go up / down with strapi
        // if disabled it will create /api/metrics endpoint on main strapi instance
        // when enabled install run `npm i express`
        enabled: false,
        port: 9000,
        host: "localhost",
        path: "/metrics",
      },
    },
  },
  graphql: {
    enabled: true,
    config: {
      apolloServer: {
        plugins: [apolloPrometheusPlugin],
        tracing: true,
      },
    },
  },
});
