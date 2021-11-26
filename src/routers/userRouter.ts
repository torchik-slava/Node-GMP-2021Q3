import { Router } from "express";
import {
  requestIdValidation,
  userRequestBodyValidation,
} from "../middleware";
import userController from "./controllers/userController";

const router = Router();

router
  .route("/")
  .get(userController.getList)
  .post(userRequestBodyValidation, userController.create);

router
  .route("/:id")
  .get(requestIdValidation, userController.getById)
  .put(requestIdValidation, userRequestBodyValidation, userController.updateById)
  .delete(requestIdValidation, userController.deleteById);

export default router;
