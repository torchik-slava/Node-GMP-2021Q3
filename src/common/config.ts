import dotenv from "dotenv";
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../.env')
});

export default {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
};