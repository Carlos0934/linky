import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) throw new Error("DATABASE_URL is required");
if (!authToken) throw new Error("DATABASE_AUTH_TOKEN is required");

const client = createClient({ url, authToken });
const db = drizzle(client);

export default db;
