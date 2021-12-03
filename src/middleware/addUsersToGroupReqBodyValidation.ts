import Joi from "joi";
import { Request, Response, NextFunction } from "express";

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
    res.status(400).send(message);
  } else {
    next();
  }
};

export default addUsersToGroupRequestBodyValidation;
