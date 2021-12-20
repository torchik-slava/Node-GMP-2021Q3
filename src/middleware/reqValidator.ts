import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors";

interface IMiddleware {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

interface IBodyValidator {
  (schema: Joi.ObjectSchema, req: Request, next: NextFunction): void;
}

const userSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string()
    .pattern(new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/))
    .message('"password" must contain letters and numbers')
    .required(),
  age: Joi.number().integer().min(4).max(130).required(),
});

const groupSchema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array()
    .items(
      Joi.string().valid("READ", "WRITE", "DELETE", "SHARE", "UPLOAD_FILES")
    )
    .min(1)
    .unique()
    .required(),
});

const userGroupSchema = Joi.object({
  groupId: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
  userIds: Joi.array()
    .items(Joi.string().guid({ version: ["uuidv4"] }))
    .min(1)
    .unique()
    .required(),
});

const loginSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const idSchema = Joi.string()
  .guid({ version: ["uuidv4"] })
  .message("Incorrect format of ID in URL");

const validateBody: IBodyValidator = (schema, req, next) => {
  const { error } = schema.validate(req.body, { allowUnknown: false });
  if (error?.isJoi) {
    const message = error.details[0].message;
    next(new BadRequestError(message));
  } else {
    next();
  }
};

const userRequestBodyValidation: IMiddleware = async (req, res, next) => {
  validateBody(userSchema, req, next);
};

const groupRequestBodyValidation: IMiddleware = async (req, res, next) => {
  validateBody(groupSchema, req, next);
};

const addUsersToGroupRequestBodyValidation: IMiddleware = async (req, res, next) => {
  validateBody(userGroupSchema, req, next);
};

const loginRequestBodyValidation: IMiddleware = async (req, res, next) => {
  validateBody(loginSchema, req, next);
};

const refreshTokenRequestBodyValidation: IMiddleware = async (req, res, next) => {
  validateBody(refreshTokenSchema, req, next);
};

const requestIdValidation: IMiddleware = async (req, res, next) => {
  const { error } = idSchema.validate(req.params.id);
  if (error?.isJoi) {
    const message = error.details[0].message;
    next(new BadRequestError(message));
  } else {
    next();
  }
};

export {
  userRequestBodyValidation,
  groupRequestBodyValidation,
  addUsersToGroupRequestBodyValidation,
  loginRequestBodyValidation,
  refreshTokenRequestBodyValidation,
  requestIdValidation,
};
