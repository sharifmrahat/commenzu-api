import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Server } from "socket.io";
import http from "http";

import { globalErrorHandler, responseData } from "./utils";
import { AppRouter } from "./routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
  transports: ["websocket"],
});

const nsp = io.of("/api/v1");
nsp.on("connection", (socket) => {
  console.log("Socket user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket user disconnected:", socket.id);
  });
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Unauthorized"));

  next();
});

app.set("io", io);

app.get("/", (req, res) => {
  return res.status(httpStatus.OK).json({
    success: true,
    message: `App endpoint is running successfully`,
  });
});

server.listen(5000, () => {
  console.log("Socket running on port 5000");
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
