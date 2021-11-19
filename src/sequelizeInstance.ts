import { Sequelize } from "sequelize";
import config from './common/config';
const { DB_NAME, DB_USER, DB_HOST, DB_PASSWORD } = config;

const dbName = DB_NAME as string;
const dbUser = DB_USER as string;
const dbHost = DB_HOST;
const dbPassword = DB_PASSWORD;
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "postgres",
  dialectOptions: {
    multipleStatements: true,
  },
  define: {
    timestamps: false,
  },
  logging: false,
});

export default sequelize;
