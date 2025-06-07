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

router
  .route("/:imageId")
  .patch(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["designId", "imageId"] }),
    validateBody(ManipulateImageInDesignParamsSchema),
    manipulateImageController
  );

router.route("/");

export default router;
