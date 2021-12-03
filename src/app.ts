import express from "express";
import userRouter from "./routers/userRouter";
import groupRouter from "./routers/groupRouter";

const app = express();
app.use(express.json());
app.use("/users", userRouter);
app.use("/groups", groupRouter);

process
  .on("uncaughtException", (err: Error) => {
    console.error(`Uncaught Exception: ${err.message}`);
  })
  .on("unhandledRejection", (err: Error) => {
    console.error(`Unhandled Rejection: ${err.message}`);
  });

export default app;
