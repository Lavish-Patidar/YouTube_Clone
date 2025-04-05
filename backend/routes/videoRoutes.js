//backend/routes/videoRoutes.js
import { Router } from "express";
import { publishAVideo, getAllVideos, getAllUserVideos, deleteVideoById, VideoDataById, viewsIncrement, likeVideo, removeLikeVideo, updateVideo } from "../controllers/videoController.js";
import { upload } from "../middlewares/multerMiddleware.js"
import { verifyJWT } from "../middlewares/authMiddleware.js"

const router = Router();

const videoUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'videoFile', maxCount: 1 },
]);

router.route("/allVideo").get(getAllVideos)
router.route("/videoData/:id").get(VideoDataById)
router.route("/allUserVideo/:owner").get(getAllUserVideos)

router.use(verifyJWT);
router.route("/publish").post(videoUpload, publishAVideo)
router.route("/delete/:id").delete(deleteVideoById)
router.route("/incrementView/:id").put(viewsIncrement)
router.route('/like').post(likeVideo);
router.route('/removelike').post(removeLikeVideo);
router.route('/update/:id').put(upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "videoFile", maxCount: 1 }
]), updateVideo);
export default router