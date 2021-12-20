import { Request, Response, NextFunction } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";
import config from "../common/config";
import { ForbiddenError, UnauthorizedError } from "../errors";

const { JWT_ACCESS_TOKEN_SECRET } = config;

const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.url === "/auth/login" || req.url === "/auth/refresh-token") return next();
  const token = req.headers.authorization;
  if (!token) {
    next(new UnauthorizedError());
  } else {
    verify(token, JWT_ACCESS_TOKEN_SECRET as string, (err, decoded) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          next(new UnauthorizedError("Unauthorized! Access token was expired!"));
        }
        next(new ForbiddenError());
      }
      next();
    });
  }
};

export default authorization;
