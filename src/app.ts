import express from "express";
import userRouter from "./routers/userRouter";
import groupRouter from "./routers/groupRouter";
import logger from "./common/logger";
import errorHandler from "./middleware/errorHandler";
import requestLogger from "./middleware/reqLogger";

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use("/users", userRouter);
app.use("/groups", groupRouter);
app.use(errorHandler);

process
  .on("uncaughtException", (err: Error) => {
    logger.error(`Uncaught Exception: ${err.stack}`)
  })
  .on("unhandledRejection", (err: Error) => {
    logger.error(`Unhandled Rejection: ${err.stack}`);
  });

//throw Error('Oops!');
//Promise.reject(Error('Oops!'));

export default app;
