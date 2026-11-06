import "dotenv/config"
import express from "express";
import type { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";

import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/users.routes.js";
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./config/swagger.js"

import { requestLogger } from "./middleware/requestLogger.js";
import { apiVersion } from "./middleware/apiVersion.js";
import prisma from "./utils/prisma.js";
import { globalLimiter } from "./middleware/rateLimit.middleware.js";
import corsMiddleware from "./middleware/cors.middleware.js";

const app = express();

interface HealthResponse {
  success: boolean;
  message: string;
}

// General middleware: register before routes.
app.use(requestLogger);
app.use(apiVersion);


app.use(corsMiddleware)
app.use(express.json());
app.use(cookieParser())
// app.use(globalLimiter);


// Health check
app.get("/health", (_req: Request, res: Response<HealthResponse>) => {
  res.status(200).json({
    success: true,
    message: "Task manager API is running",
  });
});


// Readiness check
app.get("/ready", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      success: true,
      message: "API and database are ready",
    });
  } catch (error) {
    console.error("Readiness check failed:", error);

    return res.status(503).json({
      success: false,
      message: "Service temporarily unavailable",
    });
  }
});


// Task routes
app.use("/api/v1/tasks", taskRoutes);

// User routes
app.use('/api/v1/auth', userRoutes)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 

app.use((error: Error, _req: Request, res: Response, next: NextFunction) => {

    console.error("========== GLOBAL ERROR ==========");
    console.error(error);
    console.error("===================================");

    if (res.headersSent) {
        return next(error);
    }

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

export default app;