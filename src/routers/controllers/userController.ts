import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../errors";
import userService from "../../services/userService";

const getList = async (req: Request, res: Response, next: NextFunction) => {
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
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await userService.getById(id);
    if (!user) throw new NotFoundError();
    res.json(user);
  } catch (error) {
    return next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await userService.updateById(id, req.body);
    if (!user) throw new NotFoundError();
    res.json(user);
  } catch (error) {
    return next(error);
  }
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const isSuccess = await userService.deleteById(id);
    if (!isSuccess) throw new NotFoundError();
    res.status(200).send("Deleted");
  } catch (error) {
    return next(error);
  }
};

export default { getList, getById, create, updateById, deleteById };
