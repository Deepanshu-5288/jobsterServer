import express  from "express";
import { addJob, deleteJob, editJob, getJobs, getStats } from "../controllers/jobController.js";
import { isAuthenticated } from "../middleWares/auth.js";

const router = express.Router();

router.route("/job").post(isAuthenticated, addJob).get(isAuthenticated, getJobs);
router.route("/job/:id").put(isAuthenticated, editJob).delete(isAuthenticated, deleteJob);
router.route("/me/stats").get(isAuthenticated, getStats);

export default router;