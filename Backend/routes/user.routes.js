import { Router } from "express";
import { body } from "express-validator";
import * as userController from "../controllers/user.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
    "/register",
    body("name.firstName").notEmpty().withMessage("First name is required"),
    body("name.lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    userController.createUserController
);

router.post("/login",
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    userController.loginController
);

router.post("/google", userController.googleLogin);

// New Google OAuth routes
router.get("/auth/google", userController.googleAuthURL);
router.get("/auth/google/callback", userController.googleCallback);

router.get("/profile", authMiddleware.authUser, userController.getUserProfile);

router.get("/logout", authMiddleware.authUser, userController.logoutController);

router.get("/all", authMiddleware.authUser, userController.getAllUsers);

export default router;