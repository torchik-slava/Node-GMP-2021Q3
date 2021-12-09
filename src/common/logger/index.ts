import { createLogger, transports } from "winston";

const logger = createLogger({
  transports: [
    new transports.File({
      filename: "src/common/logger/error.log",
      handleExceptions: false,
      //@ts-ignore
      handleRejections: false,
    }),
  ],
});

export default logger;
