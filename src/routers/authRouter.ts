import { Router } from "express";
import { loginRequestBodyValidation, refreshTokenRequestBodyValidation } from "../middleware";
import authController from "./controllers/authController";

const router = Router();

router
  .route("/login")
  .post(loginRequestBodyValidation, authController.login);

router
  .route("/refresh-token")
  .post(refreshTokenRequestBodyValidation, authController.refreshToken);

export default router;
