import Group, {
  GroupAttributes,
  GroupCreationAttributes,
} from "../models/groupModel";
import User from "../models/userModel";
import sequelize from "../sequelizeInstance";

const includeQuery = {
  model: User,
  attributes: ["id", "login", "age"],
  through: { attributes: [] },
  as: "users",
};

const getAll = async () =>
  Group.findAll({
    include: [includeQuery],
  });

const getById = async (id: string) =>
  Group.findByPk(id, {
    include: [includeQuery],
  });

const create = async (item: GroupCreationAttributes) => Group.create(item);

const updateById = async (id: string, data: Partial<GroupAttributes>) => {
  const group = await getById(id);
  if (group) {
    return group.update(data);
  }
};

const deleteById = async (id: string) => {
  const group = await getById(id);
  if (group) {
    await group.destroy();
    return true;
  }
};

const addUsersToGroup = async (id: string, ids: string[]) => {
  await sequelize.transaction(async (transaction) => {
    const group = await Group.findByPk(id, { transaction });
    if (group) {
      await group.addUsers(ids, { transaction });
    }
  });
  return getById(id);
};

export default {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  addUsersToGroup,
};
