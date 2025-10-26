import  Router  from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile , logoutUser } from "../controllers/UserController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";  

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);
router.post("/logout", verifyToken, logoutUser);

export default router;