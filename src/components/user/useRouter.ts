import { Router, Request, Response, NextFunction } from "express";
import { requestValidationMiddleware } from "../middleware";
import userService from "./userService";

const router = Router();

router
  .route("/")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { loginSubstring, limit } = req.query;
      const users = await userService.getList(
        loginSubstring as string,
        limit as string
      );
      res.json(users);
    } catch (error) {
      return next(error);
    }
  })
  .post(
    requestValidationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await userService.create(req.body);
        res.status(201).json(user);
      } catch (error) {
        return next(error);
      }
    }
  );

router
  .route("/:id")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await userService.getById(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).send("Not Found");
      }
    } catch (error) {
      return next(error);
    }
  })
  .put(
    requestValidationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const user = await userService.updateById(id, req.body);
        if (user) {
          res.json(user);
        } else {
          res.status(404).send("Not Found");
        }
      } catch (error) {
        return next(error);
      }
    }
  )
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const isSuccess = await userService.deleteById(id);
      if (isSuccess) {
        res.status(200).send("Deleted");
      } else {
        res.status(404).send("Not Found");
      }
    } catch (error) {
      return next(error);
    }
  });

export default router;
