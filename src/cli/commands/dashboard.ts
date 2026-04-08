import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
  meta: {
    name: "dashboard",
    description: "Open the Levi topology dashboard",
  },
  args: {},
  async run() {
    consola.info("Dashboard is coming in Phase 3.\n");
    consola.info(
      "The dashboard will provide a local web UI showing your application topology,",
    );
    consola.info(
      "worker status, log streaming, and resource connections — similar to .NET Aspire.\n",
    );
    consola.info("In the meantime, you can use:\n");
    consola.info("  levi graph     View the dependency graph in your terminal");
    consola.info(
      "  levi build     Generate configs and inspect .levi/graph.json\n",
    );
  },
});
