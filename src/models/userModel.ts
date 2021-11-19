import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../databaseInit";

export interface UserAttributes {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "isDeleted"> {}

interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

const User = sequelize.define<UserInstance>(
  "User",
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    underscored: true,
  }
);

User.prototype.toJSON =  function () {
  const attributes  = Object.assign({}, this.get());
  delete attributes.password;
  delete attributes.isDeleted;
  return attributes;
}

export default User;
