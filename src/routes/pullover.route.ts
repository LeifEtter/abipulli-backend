import { Router } from "express";
import { getAllPulloversController } from "src/controllers/pullover.controller";
import { authenticateHttp } from "src/middleware/authentication.middleware";
import { minPower } from "src/middleware/authorization.middleware";

const router: Router = Router();

router.route("/").get(authenticateHttp, minPower(1), getAllPulloversController);

export default router;
