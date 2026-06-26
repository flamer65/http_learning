export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const initialUsers: User[] = [
  { id: 1, name: "Alice", email: "alice@test.com", role: "admin" },
  { id: 2, name: "Bob", email: "bob@test.com", role: "user" },
  { id: 3, name: "Charlie", email: "charlie@test.com", role: "user" }
];

export let users: User[] = [...initialUsers];

export function resetUsers() {
  users = JSON.parse(JSON.stringify(initialUsers));
}
