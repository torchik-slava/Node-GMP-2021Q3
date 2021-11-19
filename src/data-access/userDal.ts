import { Op } from "sequelize";
import User, {
  UserAttributes,
  UserCreationAttributes,
} from "../models/userModel";
import Group from "../models/groupModel";

const includeQuery = {
  model: Group,
  through: { attributes: [] },
  as: "groups",
};

const getAll = async () =>
  User.findAll({
    where: { isDeleted: false },
    include: [includeQuery],
  });

const getById = async (id: string) =>
  User.findOne({
    where: { id, isDeleted: false },
    include: [includeQuery],
  });

const getLimitedListBySubstring = async (substring = "", limit?: number) =>
  User.findAll({
    where: { isDeleted: false, login: { [Op.substring]: substring } },
    include: includeQuery,
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
    const groups = await user.getGroups();
    const ids = groups.map(el => el.id);
    await user.removeGroups(ids);
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
