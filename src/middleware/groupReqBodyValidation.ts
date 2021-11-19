import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const schema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array()
    .items(
      Joi.string().valid("READ", "WRITE", "DELETE", "SHARE", "UPLOAD_FILES")
    )
    .min(1)
    .unique()
    .required(),
});

const groupRequestBodyValidation = async (
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

export default groupRequestBodyValidation;
