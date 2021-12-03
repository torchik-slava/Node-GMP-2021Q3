import config from "./common/config";
import app from "./app";
import initDB from './db';

const { PORT } = config;

const start = async () => {
  try {
    await initDB();
    
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Something went wrong:", error);
  }
};

start();