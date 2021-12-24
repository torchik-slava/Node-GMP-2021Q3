import userDal from "../data-access/userDal";
import groupDal from "../data-access/groupDal";
import { UserInstance } from "../models/userModel";
import { GroupInstance } from "../models/groupModel";
import mockUsers from "./mockUsers.json";
import mockGroups from "./mockGroups.json";
import request from "supertest";
import app from "../app";
import { v4 as uuidv4 } from 'uuid';

const users = [...mockUsers];
const groups = [...mockGroups];
jest.mock("../data-access/userDal");
jest.mock("../data-access/groupDal");

const mockedUserDal = userDal as jest.Mocked<typeof userDal>;
const mockedGroupDal = groupDal as jest.Mocked<typeof groupDal>;

mockedUserDal.getAll.mockImplementation(() =>
  Promise.resolve((users as UserInstance[]).filter((user) => !user.isDeleted))
);

mockedUserDal.getById.mockImplementation((id: string) =>
  Promise.resolve(
    (users as UserInstance[])
      .filter((user) => !user.isDeleted)
      .find((user) => user.id === id)
  )
);

mockedUserDal.getByLogin.mockImplementation((login: string) =>
  Promise.resolve(
    (users as UserInstance[])
      .filter((user) => !user.isDeleted)
      .find((user) => user.login === login)
  )
);

mockedUserDal.getLimitedListBySubstring.mockImplementation(
  (substring = "", limit?: number) =>
    Promise.resolve(
      (users as UserInstance[])
        .filter((user) => !user.isDeleted && user.login.includes(substring))
        .sort((a, b) => a.login.localeCompare(b.login))
        .slice(0, limit)
    )
);

mockedUserDal.create.mockImplementation((item) => {
  const newUser = { id: uuidv4(), isDeleted: false, ...item };
  users.push(newUser);
  return Promise.resolve(newUser as UserInstance);
});

mockedUserDal.updateById.mockImplementation((id: string, data) => {
  const user = users.filter((user) => !user.isDeleted).find((user) => user.id === id);
  if (user) {
    Object.entries(data).forEach(([key, value]) => (user[key] = value));
    return Promise.resolve(user as UserInstance);
  }
});

mockedUserDal.deleteById.mockImplementation((id: string) => {
  const user = users.filter((user) => !user.isDeleted).find((user) => user.id === id);
  if (user) {
    user.isDeleted = true;
    return Promise.resolve(true);
  }
});

mockedGroupDal.getAll.mockImplementation(() =>
  Promise.resolve(groups as GroupInstance[])
);

mockedGroupDal.getById.mockImplementation((id: string) =>
  Promise.resolve((groups as GroupInstance[]).find((group) => group.id === id))
);

mockedGroupDal.create.mockImplementation((item) => {
  const newGroup = { id: uuidv4(), ...item };
  groups.push(newGroup);
  return Promise.resolve(newGroup as GroupInstance);
});

mockedGroupDal.updateById.mockImplementation((id: string, data) => {
  const group = groups.find((group) => group.id === id);
  if (group) {
    Object.entries(data).forEach(([key, value]) => (group[key] = value));
    return Promise.resolve(group as GroupInstance);
  }
});

mockedGroupDal.deleteById.mockImplementation((id: string) => {
  const groupIdx = groups.findIndex((group) => group.id === id);
  if (groupIdx) {
    groups.splice(groupIdx, 1);
    return Promise.resolve(true);
  }
});

describe("User routes", () => {

  let token;
  beforeAll(async () => {
    const { body: { accessToken } } = await request(app)
      .post("/auth/login")
      .send({ login: "One", password: "password1" });
    token = accessToken;
   })

  it("GET: /users - return all existed users correctly", async () => {
    const existedUsersAmount = users.filter((user) => !user.isDeleted).length;
    const res = await request(app)
      .get("/users")
      .set("Authorization", token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(existedUsersAmount);
  });

  it("GET: /users?limit - return correct number of users", async () => {
    const limit = 4;
    const res = await request(app)
      .get(`/users?limit=${limit}`)
      .set("Authorization", token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(limit);
  });

  it("GET: /users?loginSubstring - return correct users", async () => {
    const substring = 'T';
    const res = await request(app)
      .get(`/users?loginSubstring=${substring}`)
      .set("Authorization", token);
    expect(res.status).toBe(200);
    expect(res.body[0].login).toEqual('Three');
    expect(res.body[1].login).toEqual('Two');
    expect(res.body.length).toEqual(2);
  });

  it("GET: /users/:id - return correct user by id", async () => {
    const id = "338883ee-19d6-40b4-9766-32b4f726d2aa";
    const res = await request(app)
      .get(`/users/${id}`)
      .set("Authorization", token);
    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(id);
  });

  it("GET: /users/:id - not return deleted user", async () => {
    const deletedUserId = "5570d4f4-0e0d-416a-888d-295b064e3799";
    const res = await request(app)
      .get(`/users/${deletedUserId}`)
      .set("Authorization", token);
    expect(res.status).toBe(404);
    expect(res.text).toEqual("Not Found");
  });

  it("GET: /users/:id - not return non-existed user", async () => {
    const notExistedUserId = "0ee75a1c-8fee-4e52-a44c-a234a3ffa93d";
    const res = await request(app)
      .get(`/users/${notExistedUserId}`)
      .set("Authorization", token);
    expect(res.status).toBe(404);
    expect(res.text).toEqual("Not Found");
  });

  it("POST: /users - create user correctly", async () => {
    const usersAmount = users.length;
    const res = await request(app)
      .post("/users")
      .send({ login: "TestUser", password: "testPassw0rd", age: 40 })
      .set("Authorization", token)
    expect(res.status).toBe(201);
    expect(res.body.login).toEqual("TestUser");
    expect(res.body).toHaveProperty("id");
    expect(users.length).toEqual(usersAmount + 1);
  });

  it("POST: /users - handle bad request correctly", async () => {
    const usersAmount = users.length;
    const res = await request(app)
      .post("/users")
      .send({ name: "TestUser", age: 40 })
      .set("Authorization", token)
    expect(res.status).toBe(400);
    expect(users.length).toEqual(usersAmount);
  });

  it("PUT: /users/:id - update user correctly", async () => {
    const id = "338883ee-19d6-40b4-9766-32b4f726d2aa";
    const res = await request(app)
      .put(`/users/${id}`)
      .send({ login: "Four", password: "password4", age: 44 })
      .set("Authorization", token)
    expect(res.status).toBe(200);
    expect(res.body.age).toEqual(44);
  });

  it("DELETE: /users/:id - delete user correctly", async () => {
    const id = "338883ee-19d6-40b4-9766-32b4f726d2aa";
    const res = await request(app)
      .delete(`/users/${id}`)
      .set("Authorization", token)
    expect(res.status).toBe(200);
    expect(res.text).toEqual("Deleted");
  });
});


describe("Group routes", () => {

  let token;
  beforeAll(async () => {
    const { body: { accessToken } } = await request(app)
      .post("/auth/login")
      .send({ login: "One", password: "password1" });
    token = accessToken;
   })

  it("GET: /groups - return groups correctly", async () => {
    const groupsAmount = groups.length;
    const res = await request(app)
      .get("/groups")
      .set("Authorization", token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(groupsAmount);
  });

  it("GET: /groups/:id - return correct group by id", async () => {
    const id = "7f50b154-963a-452d-b857-1605013aab5f";
    const res = await request(app)
      .get(`/groups/${id}`)
      .set("Authorization", token);
    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(id);
  });

  it("GET: /groups/:id - not return non-existed group", async () => {
    const notExistedGroupId = "0ee75a1c-8fee-4e52-a44c-a234a3ffa93d";
    const res = await request(app)
      .get(`/users/${notExistedGroupId}`)
      .set("Authorization", token);
    expect(res.status).toBe(404);
    expect(res.text).toEqual("Not Found");
  });

  it("POST: /groups - create group correctly", async () => {
    const groupsAmount = groups.length;
    const res = await request(app)
      .post("/groups")
      .send({ name: "TestGroup", permissions: ["READ"] })
      .set("Authorization", token)
    expect(res.status).toBe(201);
    expect(res.body.name).toEqual("TestGroup");
    expect(res.body).toHaveProperty("id");
    expect(groups.length).toEqual(groupsAmount + 1);
  });

  it("POST: /groups - handle bad request correctly", async () => {
    const groupsAmount = groups.length;
    const res = await request(app)
      .post("/groups")
      .send({ name: "TestGroup", permissions: ["INCORRECT_VALUE"] })
      .set("Authorization", token)
    expect(res.status).toBe(400);
    expect(groups.length).toEqual(groupsAmount);
  });

  it("PUT: /groups/:id - update group correctly", async () => {
    const id = "e7fe5cff-0de8-4f26-92f6-1c32fd6c25d7";
    const res = await request(app)
      .put(`/groups/${id}`)
      .send({ name: "EditedGroup", permissions: ["READ", "WRITE", "DELETE"] })
      .set("Authorization", token)
    expect(res.status).toBe(200);
    expect(res.body.name).toEqual("EditedGroup");
  });

  it("DELETE: /groups/:id - delete group correctly", async () => {
    const groupsAmount = groups.length;
    const id = "e7fe5cff-0de8-4f26-92f6-1c32fd6c25d7";
    const res = await request(app)
      .delete(`/groups/${id}`)
      .set("Authorization", token)
    expect(res.status).toBe(200);
    expect(res.text).toEqual("Deleted");
    expect(groups.length).toEqual(groupsAmount - 1);
  });
});
