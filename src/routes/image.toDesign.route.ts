import {
  getAllImagesForDesignController,
  manipulateImageController,
  placeImageOnDesignController,
  removeImageFromDesignController,
} from "src/controllers/image.toDesignController";
import { Router } from "express";
import { authenticateHttp } from "src/middleware/authentication.middleware";
import { minPower } from "src/middleware/authorization.middleware";
import {
  validateBody,
  validateParams,
} from "src/middleware/validation.middleware";
import {
  AddImageToDesignParamsSchema,
  ManipulateImageInDesignParamsSchema,
} from "abipulli-types";
const router = Router({ mergeParams: true });

router
  .route("/")
  .get(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["designId"] }),
    getAllImagesForDesignController
  );

router
  .route("/:imageId")
  .post(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["designId", "imageId"] }),
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

router
  .route("/:imageToDesignId")
  .delete(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["designId", "imageToDesignId"] }),
    removeImageFromDesignController
  );

router.route("/");

export default router;
