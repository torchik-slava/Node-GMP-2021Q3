import { Op } from "sequelize";
import User, {
  UserAttributes,
  UserCreationAttributes,
} from "../models/userModel";

const getAll = async () => User.findAll({ where: { isDeleted: false } });

const getById = async (id: string) => User.findOne({ where: { id, isDeleted: false } });

const getLimitedListBySubstring = async (substring = "", limit?: number) =>
  User.findAll({
    where: { isDeleted: false, login: { [Op.substring]: substring } },
    order: [["login", "ASC"]],
    limit,
  });

const create = async (item: UserCreationAttributes) => User.create(item);

const updateById = async (id: string, data: Partial<UserAttributes>) => {
  const user = await getById(id);
  if (user) {
    return user.update(data);
  }
};

const deleteById = async (id: string) => {
  const user = await getById(id);
  if (user) {
    user.set("isDeleted", true);
    user.save();
    return true;
  }
};

export default {
  getAll,
  getById,
  getLimitedListBySubstring,
  create,
  updateById,
  deleteById,
};
