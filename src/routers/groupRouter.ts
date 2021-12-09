import { Router } from "express";
import {
  requestIdValidation,
  groupRequestBodyValidation,
  addUsersToGroupRequestBodyValidation,
} from "../middleware";
import groupController from "./controllers/groupController";

const router = Router();

router
  .route("/")
  .get(groupController.getList)
  .post(groupRequestBodyValidation, groupController.create);

router
  .route("/add-users")
  .put(addUsersToGroupRequestBodyValidation, groupController.addUsersToGroup);

router
  .route("/:id")
  .get(requestIdValidation, groupController.getById)
  .put(requestIdValidation, groupRequestBodyValidation, groupController.updateById)
  .delete(requestIdValidation, groupController.deleteById);

export default router;
