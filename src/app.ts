import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { globalErrorHandler, responseData } from "./utils";
import { AppRouter } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.status(httpStatus.OK).json({
    success: true,
    message: `App endpoint is running successfully`,
  });
});

//* Default Routes
app.use("/api/v1", AppRouter);

//* Global Error Handler
app.use(globalErrorHandler);

//* Not Found Route Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  return responseData(
    {
      statusCode: httpStatus.NOT_FOUND,
      status: false,
      message: "API end-point not found",
    },
    res
  );
});

export default app;
