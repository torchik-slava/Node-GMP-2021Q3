import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../errors";
import groupService from "../../services/groupService";

const getList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await groupService.getList();
    res.json(groups);
  } catch (error) {
    return next(error);
  }
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const group = await groupService.getById(id);
    if (!group) throw new NotFoundError();
    res.json(group);
  } catch (error) {
    return next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await groupService.create(req.body);
    res.status(201).json(group);
  } catch (error) {
    return next(error);
  }
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const group = await groupService.updateById(id, req.body);
    if (!group) throw new NotFoundError();
    res.json(group);
  } catch (error) {
    return next(error);
  }
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const isSuccess = await groupService.deleteById(id);
    if (!isSuccess) throw new NotFoundError();
    res.status(200).send("Deleted");
  } catch (error) {
    return next(error);
  }
};

const addUsersToGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await groupService.addUsersToGroup(req.body);
    if (!group) throw new NotFoundError();
    res.json(group);
  } catch (error) {
    return next(error);
  }
};

export default {
  getList,
  getById,
  create,
  updateById,
  deleteById,
  addUsersToGroup,
};
