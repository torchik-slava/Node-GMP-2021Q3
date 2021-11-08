import userDal from "../data-access/userDal";
import { UserAttributes, UserCreationAttributes } from "../models/userModel";

const getList = async (substring?: string, limit?: string) => {
  let users;
  if (substring !== undefined || limit !== undefined) {
    const isPositiveInteger = !!limit && /^\+?\d+$/.test(limit);
    const listLimit = isPositiveInteger ? Number(limit) : undefined;
    users = await userDal.getLimitedListBySubstring(substring, listLimit);
  } else {
    users = await userDal.getAll();
  }
  return users.map((user) => user);
};

const getById = async (id: string) => {
  const user = await userDal.getById(id);
  if (user) {
    return user;
  }
};

const create = async (userData: UserCreationAttributes) => {
  const { login, password, age } = userData;
  const createdUser = userDal.create({ login, password, age });
  if (createdUser) {
    return createdUser;
  }
};

const updateById = async (id: string, userData: Partial<UserAttributes>) => {
  const updatedUser = await userDal.updateById(id, userData);
  if (updatedUser) {
    return updatedUser;
  }
};

const deleteById = async (id: string) => {
  return userDal.deleteById(id);
};

export default { getList, getById, create, updateById, deleteById };
