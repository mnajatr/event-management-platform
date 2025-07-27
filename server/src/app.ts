import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { ZodError } from "zod";
import eventRoutes from "./routes/event.routes";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.use("/api/events", eventRoutes);
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
