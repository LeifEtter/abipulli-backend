import express from "express";
import { pinoHttp } from "pino-http";
import { httpLogger, logger } from "./logging/logger";
import router from "./route";
import { apiErrorHandler } from "./error/errorMiddleware";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());

app.use(httpLogger);
app.use(cookieParser());
app.use(router);

app.use(apiErrorHandler);

app.route("/test").get((req: express.Request, res: express.Response): void => {
  res.status(200).send({ message: "Working" });
});

export default app;
