import express from "express";
import { pinoHttp } from "pino-http";
import logger from "./logging/logger";
import router from "./route";
import { apiErrorHandler } from "./error/errorMiddleware";
const app = express();

app.use(express.json());

app.use(
  pinoHttp({
    logger,
  })
);
app.use(router);

app.use(apiErrorHandler);

app.route("/test").get((req: express.Request, res: express.Response): void => {
  res.status(200).send({ message: "Working" });
});

export default app;
