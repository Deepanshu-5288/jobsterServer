import express  from "express";
import { loginUser, logoutUser, registerUser, updateUser } from "../controllers/userController.js";
import {isAuthenticated} from "../middleWares/auth.js";
const router = express.Router();

router.route("/auth/register").post(registerUser);
router.route("/auth/login").post(loginUser);
router.route("/auth/logout").get(logoutUser);
router.route("/me/update").put(isAuthenticated, updateUser);
export default router;