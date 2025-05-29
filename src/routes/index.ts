import { Router } from "express";
import userRouter from "./user.route";
import orderRouter from "./order.route";
import imageRouter from "./image.route";
import designRouter from "./design.route";
import chatRouter from "./chat.route";
const router = Router();

router.use("/user", userRouter);
router.use("/order", orderRouter);
router.use("/image", imageRouter);
router.use("/design", designRouter);
router.use("/chat", chatRouter);
export default router;
