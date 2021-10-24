import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const schema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string()
    .pattern(new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/))
    .message('\"password\" must contain letters and numbers')
    .required(),
  age: Joi.number().integer().min(4).max(130).required(),
});

const requestValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = schema.validate(req.body, { allowUnknown: false });
  if (error?.isJoi) {
    const message = error.details[0].message;
    res.status(400).json(message);
  } else {
    next();
  }
};

export default requestValidation;
