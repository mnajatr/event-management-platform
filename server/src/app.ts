import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { ZodError } from "zod";
import eventRoutes from "./routes/event.routes";
import authRoutes from "./routes/auth.routes";
import { HttpException } from "./exceptions/http.exception";
import logger from "./utils/logger";

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
    this.app.use("/api/events", eventRoutes);
    this.app.use("/api/auth", authRoutes)
  }

  private initializeErrorHandling(): void {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof ZodError) {
          return res.status(400).json({
            message: "Validation error",
            errors: err.issues,
          });
        }

        if (err instanceof HttpException) {
          return res.status(err.statusCode).json({message: err.message})
        }
        if (err instanceof Error) {
          res.status(500).json({
            message: "Internal Server Error",
            err: err.message,
          });
        }
        res.status(500).json({ message: "An unexpected error occurred" });
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
