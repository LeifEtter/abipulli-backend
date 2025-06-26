import express from "express";
import http from "http";
import { httpLogger, logger } from "./lib/logger";
import { apiErrorHandler } from "./middleware/error.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerOptions } from "./configs/swagger.config";
import router from "./routes";
import { Server } from "socket.io";
import { authenticateSocket } from "./middleware/authentication.middleware";
import { getChatInfo } from "./middleware/chat.middleware";
import { Chat } from "abipulli-types";
import { handleMessage } from "./middleware/message.middleware";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cookie: true,
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
      // "https://www.postman.com",
      // "http://localhost",
      "https://etter.app",
      "http://localhost:3000",
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

io.use(authenticateSocket);

io.use(getChatInfo);

io.on("connection", (socket) => {
  const chat: Chat = socket.data.chat;
  const userData: TokenContent = socket.data.user;
  socket.join(chat.id.toString());
  logger.info(`User ${userData.user_id} connected to chat ${chat.id}.`);

  handleMessage(socket);

  socket.on("disconnect", () => {
    console.log("User Disconnected from Socket:", socket.id);
  });
});

io.on("connect_error", (err) => {
  logger.error(err);
});

export default server;
