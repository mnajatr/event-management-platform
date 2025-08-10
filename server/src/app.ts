import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { ZodError } from "zod";
import eventRoutes from "./routes/event.routes";
import authRoutes from "./routes/auth.routes";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import userRoutes from "./routes/user.routes";
import logger from "./utils/logger";
import voucherRouters from "./routes/voucher.routes";
import organizerRouter from "./routes/organizer.route";
import statisticRouter from "./routes/statistic.routes";
import attendeeRoutes from "./routes/attendees.routes";
import transactionRoutes from "./routes/transaction.routes";
import organizerTransactionRoutes from "./routes/organizer/transaction.routes";
import systemTransactionRoute from "./routes/system/transaction.routes";

import path from "path";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    const corsOptions = {
      origin: "http://localhost:3000",
    };
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.originalUrl}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check route
    this.app.get("/api/health", (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: "API is running",
        uptime: `${process.uptime().toFixed(2)} seconds`,
        timestamp: new Date().toISOString(),
      });
    });

    // API Routes
    this.app.use("/api/events", eventRoutes);
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/vouchers", voucherRouters);
    this.app.use("/api/users", userRoutes);
    this.app.use("/uploads", express.static("uploads"));
    this.app.use("/api/organizers", organizerRouter);
    this.app.use("/api/statistics", statisticRouter);
    this.app.use("/api/organizers", attendeeRoutes);
    this.app.use("/api/transactions", transactionRoutes);
    this.app.use("/api/organizers", organizerTransactionRoutes);
    this.app.use("/api/system", systemTransactionRoute);
    // Handle 404 - Must be AFTER all routes
    this.app.use(notFoundMiddleware);
  }

  private initializeErrorHandling(): void {
    // Use your existing error handling + our errorMiddleware as fallback
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof ZodError) {
          return res.status(400).json({
            message: "Validation error",
            errors: err.issues,
          });
        }

        // Use our errorMiddleware for other errors (including AppError)
        errorMiddleware(err, req, res, next);
      }
    );
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running and listening on port ${port} 🚀`);
    });
  }
}

export default App;
