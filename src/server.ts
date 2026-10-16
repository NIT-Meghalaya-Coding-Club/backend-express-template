import express from "express";
import { config } from "./config/env.js";
import { rootRoutes } from "./rootRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(rootRoutes);

// Start server
app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});
