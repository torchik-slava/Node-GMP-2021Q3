import express from "express";
import userRouter from "./components/user/useRouter";

const app = express();
app.use(express.json());
app.use("/user", userRouter);

process
  .on("uncaughtException", (err: Error) => {
    console.error(`Uncaught Exception: ${err.message}`);
  })
  .on("unhandledRejection", (err: Error) => {
    console.error(`Unhandled Rejection: ${err.message}`);
  });

export default app;
