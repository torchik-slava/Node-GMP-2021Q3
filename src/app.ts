import express from "express";
import cors from 'cors';
import userRouter from "./routers/userRouter";
import groupRouter from "./routers/groupRouter";
import authRouter from "./routers/authRouter";
import logger from "./common/logger";
import errorHandler from "./middleware/errorHandler";
import requestLogger from "./middleware/reqLogger";
import authorization from "./middleware/authorization";

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: true,
  methods: "GET,HEAD,PUT,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);
app.use(authorization);
app.use("/auth", authRouter);
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
