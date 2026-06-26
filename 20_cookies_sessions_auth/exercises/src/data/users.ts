import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

// In-memory array to store users
export const users: any[] = [];

const SALT_LEN = 16; // bytes
const KEY_LEN = 64; // bytes

export const createUser = async (username: string, passwordPlain: string) => {
  const salt = randomBytes(SALT_LEN).toString("hex");
  const derived = (await scrypt(passwordPlain, salt, KEY_LEN)) as Buffer;
  const passwordHash = `${salt}:${derived.toString("hex")}`;
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

export const verifyPassword = async (passwordPlain: string, stored: string) => {
  try {
    const [salt, keyHex] = stored.split(":");
    const derived = (await scrypt(passwordPlain, salt, KEY_LEN)) as Buffer;
    const key = Buffer.from(keyHex, "hex");
    if (key.length !== derived.length) return false;
    return timingSafeEqual(key, derived);
  } catch (e) {
    return false;
  }
};
