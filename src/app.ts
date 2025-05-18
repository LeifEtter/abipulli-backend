import express from "express";
import { httpLogger } from "./logging/logger";
import router from "./route";
import { apiErrorHandler } from "./error/errorMiddleware";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

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

app.use(apiErrorHandler);

app.route("/test").get((req: express.Request, res: express.Response): void => {
  res.status(200).send({ message: "Working" });
});

export default app;
