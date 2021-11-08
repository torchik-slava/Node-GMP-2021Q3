import { readFileSync } from "fs";
import app from "./app";
import sequelize from "./databaseInit";

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to database has been established successfully.");
    const init_sql_string = readFileSync("src/databaseInit.sql", "utf8");
    await sequelize.query(init_sql_string);
    console.log("Table 'Users' has been created successfully.");
    app.listen(process.env.PORT, () => {
      console.log(`Server started at http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Something went wrong:", error);
  }
};

start();