import express  from "express";
import { addJob, deleteJob, editJob, getJobs, getStats } from "../controllers/jobController.js";
import { isAuthenticated, isAuthorized } from "../middleWares/auth.js";

const router = express.Router();

router.route("/job").post(isAuthenticated,isAuthorized("testUser"), addJob).get(isAuthenticated, getJobs);
router.route("/job/:id").put(isAuthenticated,isAuthorized("testUser"), editJob).delete(isAuthenticated,isAuthorized("testUser"), deleteJob);
router.route("/me/stats").get(isAuthenticated, getStats);

export default router;