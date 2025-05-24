import { AddImageToDesignSchema } from "abipulli-types";
import { placeImageOnDesignController } from "src/controllers/image.toDesignController";
import { Router } from "express";
import { authenticate } from "src/middleware/authentication.middleware";
import { minPower } from "src/middleware/authorization.middleware";
import { validateBody } from "src/middleware/validation.middleware";
const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    authenticate,
    minPower(2),
    validateBody(AddImageToDesignSchema),
    placeImageOnDesignController
  );

export default router;
