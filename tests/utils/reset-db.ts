import db from "@/lib/db";
import {
  links,
  users,
  accounts,
  linkVisits,
  sessions,
  verificationTokens,
} from "@/lib/db/schema";

export const resetDb = async () => {
  if (process.env.NODE_ENV !== "test")
    throw new Error("resetDb should only be used in tests");

  const tables = [
    links,
    users,
    accounts,
    linkVisits,
    sessions,
    verificationTokens,
  ];

  await db.transaction(async (db) => {
    for (const table of tables) {
      await db.delete(table);
    }
  });
};
