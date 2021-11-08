import db from "../db";
import User from "./userModel";

const getList = (substring?: string, limit?: string) => {
  let users: User[];
  if (substring !== undefined || limit !== undefined) {
    const isPositiveInteger = !!limit && /^\+?\d+$/.test(limit);
    const listLimit = isPositiveInteger ? Number(limit) : undefined;
    users = db.getLimitedListBySubstring("login", substring, listLimit);
  } else {
    users = db.getAll();
  }
  return users.map((user) => User.toResponse(user));
};

const getById = (id: string) => {
  const user = db.getById(id);
  if (user) {
    return User.toResponse(user);
  }
};

const create = (userData: Pick<User, "login" | "password" | "age">) => {
  const { login, password, age } = userData;
  const newUser = new User(login, password, age);
  const savedUser = db.create(newUser);
  if (savedUser) {
    return User.toResponse(savedUser);
  }
};

const updateById = (id: string, userData: Partial<User>) => {
  const updatedUser = db.updateById(id, userData);
  if (updatedUser) {
    return User.toResponse(updatedUser);
  }
};

const deleteById = (id: string) => {
  return db.deleteById(id);
};

export default { getList, getById, create, updateById, deleteById };
