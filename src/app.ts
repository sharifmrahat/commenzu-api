import cors from "cors";
import express from "express";
import httpStatus from "http-status";

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

export default app;
