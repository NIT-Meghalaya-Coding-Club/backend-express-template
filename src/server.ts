import express from "express";
import { config } from "./config/env.js";
import { rootRoutes } from "./rootRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes — keep rootRoutes last: it also serves the 404 fallback.
app.use(rootRoutes);

// Start server
const server = app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});

// Graceful shutdown: stop accepting new connections and let in-flight
// requests finish before the process exits.
const shutdown = (signal: NodeJS.Signals): void => {
  console.log(`${signal} received, shutting down...`);

  server.close((error) => {
    if (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }

    console.log("Server closed");
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
