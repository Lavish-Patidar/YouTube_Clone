//backend/routes/channelRoutes.js
import { Router } from "express";
import {
  createChannel, getChannel, updateChannel, deleteChannel, subscribeToChannel, unsubscribeFromChannel
} from "../controllers/channelController.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();


router.route("/create").post(verifyJWT, createChannel);
router.route("/data/:id").get(getChannel);
router.route("/update/:id")
  .put(upload.fields([{ name: "banner", maxCount: 1 }, { name: "avatar", maxCount: 1 }]), updateChannel);

router.route("/delete/:id").delete(verifyJWT, deleteChannel);
router.route("/subscribe/:id").post(verifyJWT, subscribeToChannel);
router.route("/unsubscribe/:id").post(verifyJWT, unsubscribeFromChannel);

export default router;
