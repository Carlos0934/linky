import db from "@/lib/db";
import { users } from "@/lib/db/schema";

export const createUser = async (data: { id: string; email: string }) => {
  await db.insert(users).values(data);
};
