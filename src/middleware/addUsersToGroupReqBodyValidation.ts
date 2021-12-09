import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors";

const schema = Joi.object({
  groupId: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
  userIds: Joi.array()
    .items(Joi.string().guid({ version: ["uuidv4"] }))
    .min(1)
    .unique()
    .required(),
});

const addUsersToGroupRequestBodyValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = schema.validate(req.body, { allowUnknown: false });
  if (error?.isJoi) {
    const message = error.details[0].message;
    next(new BadRequestError(message));
  } else {
    next();
  }
};

export default addUsersToGroupRequestBodyValidation;
