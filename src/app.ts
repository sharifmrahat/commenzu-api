import cors from "cors";
import express from "express";
import httpStatus from "http-status";
import globalErrorHandler from "./middlewares/global-error-handler";

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

//* Global Error Handler
app.use(globalErrorHandler);

export default app;
