import groupDal from "../data-access/groupDal";
import { GroupAttributes, GroupCreationAttributes } from "../models/groupModel";
import userService from "./userService";

const getList = async () => groupDal.getAll();

const getById = async (id: string) => {
  const group = await groupDal.getById(id);
  if (group) {
    return group;
  }
};

const create = async (groupData: GroupCreationAttributes) => {
  const { name, permissions } = groupData;
  const createdGroup = groupDal.create({ name, permissions });
  if (createdGroup) {
    return createdGroup;
  }
};

const updateById = async (id: string, groupData: Partial<GroupAttributes>) => {
  const updatedGroup = await groupDal.updateById(id, groupData);
  if (updatedGroup) {
    return updatedGroup;
  }
};

const deleteById = async (id: string) => {
  return groupDal.deleteById(id);
};

const addUsersToGroup = async (associationData: {
  groupId: string;
  userIds: string[];
}) => {
  const { groupId, userIds } = associationData;
  const existedUserIds = await (await userService.getList()).map(user => user.id);
  const isAllIdsExist = userIds.every(id => existedUserIds.includes(id));
  if (!isAllIdsExist) throw new Error('Wrong data');
  const updatedGroup = await groupDal.addUsersToGroup(groupId, userIds);
  if (updatedGroup) {
    return updatedGroup;
  }
};

export default {
  getList,
  getById,
  create,
  updateById,
  deleteById,
  addUsersToGroup,
};
