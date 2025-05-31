import { placeImageOnDesignController } from "src/controllers/image.toDesignController";
import { Router } from "express";
import { authenticateHttp } from "src/middleware/authentication.middleware";
import { minPower } from "src/middleware/authorization.middleware";
import { validateBody } from "src/middleware/validation.middleware";
import { AddImageToDesignParamsSchema } from "abipulli-types";
const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    authenticateHttp,
    minPower(2),
    validateBody(AddImageToDesignParamsSchema),
    placeImageOnDesignController
  );

export default router;
