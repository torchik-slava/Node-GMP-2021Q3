import { readFileSync } from 'fs';
import sequelize from './sequelizeInstance';
import Group from './models/groupModel';
import User from './models/userModel';

const init = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to database has been established successfully.");
    
    User.belongsToMany(Group, { through: 'user_group', as: 'groups' });
    Group.belongsToMany(User, { through: 'user_group', as: 'users' });
    console.log('Models relationships created successfully.');

    await sequelize.drop();
    
    const init_sql_string = readFileSync("src/databaseInit.sql", "utf8");
    await sequelize.query(init_sql_string);
    console.log("Table 'Users' has been created and pre-filled by SQL script successfully.");

    await sequelize.sync();

  } catch (error) {
    console.log(error);
  }
};

export default init;
