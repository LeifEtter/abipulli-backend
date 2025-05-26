import express from "express";
import http from "http";
import { httpLogger } from "./lib/logger";
import { apiErrorHandler } from "./middleware/error.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerOptions } from "./configs/swagger.config";
import router from "./routes";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

app.use(express.json());

app.use(httpLogger);
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.postman.com",
      "http://localhost",
    ],
    credentials: true,
  })
);

app.use(router);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc(swaggerOptions))
);

app.use(apiErrorHandler);

app.route("/test").get((req: express.Request, res: express.Response): void => {
  res.status(200).send({ message: "Working" });
});

io.on("connection", (socket) => {
  console.log("User Connected to Socket:", socket.id);

  socket.on("send_message", (message: string) => {
    io.emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected from Socket:", socket.id);
  });
});

export default server;
