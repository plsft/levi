import { defineCommand, runMain } from "citty";

const main = defineCommand({
  meta: {
    name: "levi",
    version: "0.4.0",
    description:
      "The AppHost Framework for Cloudflare — Aspire for Cloudflare. Declare your entire Cloudflare topology in TypeScript.",
  },
  subCommands: {
    init: () => import("./commands/init.js").then((m) => m.default),
    build: () => import("./commands/build.js").then((m) => m.default),
    dev: () => import("./commands/dev.js").then((m) => m.default),
    deploy: () => import("./commands/deploy.js").then((m) => m.default),
    provision: () => import("./commands/provision.js").then((m) => m.default),
    graph: () => import("./commands/graph.js").then((m) => m.default),
    dashboard: () => import("./commands/dashboard.js").then((m) => m.default),
    eject: () => import("./commands/eject.js").then((m) => m.default),
    diff: () => import("./commands/diff.js").then((m) => m.default),
  },
});

runMain(main);
