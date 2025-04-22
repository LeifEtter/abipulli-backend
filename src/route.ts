import { Router } from "express";
import userRouter from "./components/user/user.route";
import orderRouter from "./components/order/order.route";
import imageRouter from "./components/image/image.route";
import designRouter from "./components/design/design.route";
const router = Router();

router.use("/user", userRouter);
router.use("/order", orderRouter);
router.use("/image", imageRouter);
router.use("/design", designRouter);

export default router;
