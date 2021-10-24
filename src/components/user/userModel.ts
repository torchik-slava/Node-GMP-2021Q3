import { v4 as uuid } from "uuid";

class User {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;

  constructor(login: string, password: string, age: number) {
    this.id = uuid();
    this.login = login;
    this.password = password;
    this.age = age;
    this.isDeleted = false;
  }

  static toResponse(user: User) {
    const { id, login, age } = user;
    return { id, login, age };
  }
}

export default User;
