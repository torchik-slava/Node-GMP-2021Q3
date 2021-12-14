import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors";

const schema = Joi.object({
  refreshToken: Joi.string().required(),
});

const refreshTokenRequestBodyValidation = async (
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

export default refreshTokenRequestBodyValidation;
