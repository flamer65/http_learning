import bcrypt from "bcryptjs";

export const users: any[] = [];

export const createUser = async (username: string, passwordPlain: string) => {
  const passwordHash = await bcrypt.hash(passwordPlain, 10);
  const user = { id: String(users.length + 1), username, password: passwordHash };
  users.push(user);
  return user;
};

export const findUserByUsername = (username: string) => {
  return users.find(u => u.username === username);
};

export const findUserById = (id: string) => {
  return users.find(u => u.id === id);
};

export const verifyPassword = async (passwordPlain: string, hash: string) => {
  return bcrypt.compare(passwordPlain, hash);
};
