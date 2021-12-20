import { Request, Response, NextFunction } from "express";
import { sign, verify } from "jsonwebtoken";
import config from "../../common/config";
import { ForbiddenError, UnauthorizedError } from "../../errors";
import userService from "../../services/userService";

const { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } = config;

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { login, password } = req.body;
    const user = await userService.getByLogin(login);
    if (!user || user.password !== password) {
      throw new UnauthorizedError("Unauthorized! Bad login/password combination!");
    }
    const payload = { id: user.id, login: user.login };
    const accessToken = sign(payload, JWT_ACCESS_TOKEN_SECRET as string, { expiresIn: '1m' });
    const refreshToken = sign(payload, JWT_REFRESH_TOKEN_SECRET as string, { expiresIn: '60m' }); 
    res.json({ accessToken, refreshToken });
  } catch (error) {
    return next(error);
  }
};

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    verify(refreshToken as string, JWT_REFRESH_TOKEN_SECRET as string, (err, decoded) => {
      if (err) throw new ForbiddenError();
      const payload = { id: decoded?.id, login: decoded?.login };
      const newAccessToken = sign(payload, JWT_ACCESS_TOKEN_SECRET as string, { expiresIn: '1m' });
      res.json({ accessToken: newAccessToken, refreshToken });
    });
  } catch (error) {
    return next(error);
  }
};

export default { login, refreshToken };
