import express from "express";
import { pinoHttp } from "pino-http";
import logger from "./logging/logger";

const app = express();

app.use(express.json());

app.use(
  pinoHttp({
    logger,
  })
);
app.use(router);


app.route("/test").get((req: express.Request, res: express.Response): void => {
  res.status(200).send({ message: "Working" });
});

export default app;
