import { Router } from "express";

const router = Router({ mergeParams: true });

router.route("/").get();
