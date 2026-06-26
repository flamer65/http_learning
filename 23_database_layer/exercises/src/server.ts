import { createApp } from "./app";
import { createDbConnection } from "./config/database";
import { SqliteTodoRepository } from "./repositories/sqlite.repository";

const db = createDbConnection("app.db");
const repository = new SqliteTodoRepository(db);

const app = createApp(repository);
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
