import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const schema = Joi.string()
  .guid({ version: ["uuidv4"] })
  .message("Incorrect format of User ID in URL");

const requestIdValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = schema.validate(req.params.id);
  if (error?.isJoi) {
    const message = error.details[0].message;
    res.status(400).send(message);
  } else {
    next();
  }
};

export default requestIdValidation;
