import { Router, Request, Response, NextFunction } from "express";
import {
  requestIdValidation,
  groupRequestBodyValidation,
  addUsersToGroupRequestBodyValidation,
} from "../middleware";
import groupService from "../services/groupService";

const router = Router();

router
  .route("/")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groups = await groupService.getList();
      res.json(groups);
    } catch (error) {
      return next(error);
    }
  })
  .post(
    groupRequestBodyValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const group = await groupService.create(req.body);
        res.status(201).json(group);
      } catch (error) {
        return next(error);
      }
    }
  );

router
  .route("/add-users")
  .put(
    addUsersToGroupRequestBodyValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const group = await groupService.addUsersToGroup(req.body);
        if (group) {
          res.json(group);
        } else {
          res.status(404).send("Not Found");
        }
      } catch (error) {
        if (error instanceof Error && error.message === "Wrong data") {
          return res.status(400).send("All or some userIds are not existed!"); 
        }
        return next(error);
      }
    }
  );

router
  .route("/:id")
  .get(
    requestIdValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const group = await groupService.getById(id);
        if (group) {
          res.json(group);
        } else {
          res.status(404).send("Not Found");
        }
      } catch (error) {
        return next(error);
      }
    }
  )
  .put(
    requestIdValidation,
    groupRequestBodyValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const group = await groupService.updateById(id, req.body);
        if (group) {
          res.json(group);
        } else {
          res.status(404).send("Not Found");
        }
      } catch (error) {
        return next(error);
      }
    }
  )
  .delete(
    requestIdValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const isSuccess = await groupService.deleteById(id);
        if (isSuccess) {
          res.status(200).send("Deleted");
        } else {
          res.status(404).send("Not Found");
        }
      } catch (error) {
        return next(error);
      }
    }
  );

export default router;
