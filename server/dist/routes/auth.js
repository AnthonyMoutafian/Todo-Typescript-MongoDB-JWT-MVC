import express from "express";
import { AuthController } from "../controllers/authController.js";
import upload from "../middleware/upload.js";
import { checkAuth } from "../middleware/checkAuth.js";
const authRouter = express.Router();
const authController = new AuthController();
authRouter.post("/register", authController.registerUser.bind(authController));
authRouter.post("/login", authController.loginUser.bind(authController));
authRouter.post("/logout", checkAuth, authController.logoutUser.bind(authController));
authRouter.put("/avatar", checkAuth, upload.single("avatar"), authController.uploadAvatar.bind(authController));
authRouter.delete("/avatar", checkAuth, authController.deleteAvatar.bind(authController));
export default authRouter;
//# sourceMappingURL=auth.js.map