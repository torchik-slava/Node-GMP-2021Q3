import User from "./user/userModel";

const itemsArray: User[] = [];

const getAll = () => itemsArray.filter((item) => item.isDeleted === false);
const getById = (id: string) => getAll().find((item) => id === item.id);
const getLimitedListBySubstring = (
  key: "login",
  substring = "",
  limit?: number
) => {
  return itemsArray
    .filter((item) => item[key].toLowerCase().includes(substring.toLowerCase()))
    .sort((itemA, itemB) => itemA.login.localeCompare(itemB.login))
    .slice(0, limit);
};

const create = (item: User) => {
  itemsArray.push(item);
  return getById(item.id);
};

const updateById = (id: string, data: Partial<User>) => {
  const index = itemsArray.findIndex((item) => item.id === id);
  if (index !== -1) {
    const item = itemsArray[index];
    if (!item.isDeleted) {
      itemsArray[index] = { ...item, ...data };
    }
  }
  return getById(id);
};
const deleteById = (id: string) => {
  const item = getById(id);
  if (item) {
    item.isDeleted = true;
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
