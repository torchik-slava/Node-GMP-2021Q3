import { Request, Response, NextFunction } from "express";

const requestLogger = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { params, query, body } = req;
  const args = JSON.stringify({ params, query, body });
  console.log(`Method: ${req.method}; Arguments: ${args}`);
  next();
};

export default requestLogger;
