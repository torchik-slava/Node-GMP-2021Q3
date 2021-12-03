import {
  Model,
  DataTypes,
  Optional,
  HasManyAddAssociationsMixin,
} from "sequelize";
import sequelize from "../sequelizeInstance";
import { UserInstance } from "./userModel";

type Permission = "READ" | "WRITE" | "DELETE" | "SHARE" | "UPLOAD_FILES";

export interface GroupAttributes {
  id: string;
  name: string;
  permissions: Permission[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GroupCreationAttributes
  extends Optional<GroupAttributes, "id"> {}

export interface GroupInstance
  extends Model<GroupAttributes, GroupCreationAttributes>,
    GroupAttributes {
  addUsers: HasManyAddAssociationsMixin<UserInstance, string>;
}

const Group = sequelize.define<GroupInstance>(
  "Group",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  {
    tableName: "groups",
  }
);

export default Group;
