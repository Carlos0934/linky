import {
  integer,
  sqliteTable,
  text,
  primaryKey,
  index,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "@auth/core/adapters";

import { LINK_SHORT_PATH_LENGTH, LinkStatus } from "../domain/links";

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const links = sqliteTable(
  "link",
  {
    id: text("id").notNull().primaryKey(),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
    originalUrl: text("originalUrl").unique().notNull(),
    shortPath: text("shortPath", {
      length: LINK_SHORT_PATH_LENGTH,
    })
      .unique()
      .notNull(),
    status: text("status", {
      enum: [LinkStatus.Active, LinkStatus.Inactive],
    }).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => ({
    shortPathIndex: index("shortPathIndex").on(table.shortPath),
  })
);

export const linkVisits = sqliteTable(
  "linkVisit",
  {
    id: text("id").notNull().primaryKey(),
    linkId: text("linkId")
      .references(() => links.id, { onDelete: "cascade" })
      .notNull(),
    referer: text("referer"),
    ip: text("ip"),
    country: text("country"),
    city: text("city"),
    os: text("os"),
    engine: text("engine"),
    device: text("device"),
    deviceType: text("deviceType"),
    browser: text("browser"),
    createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => ({
    linkIdIndex: index("linkIdIndex").on(table.linkId),
  })
);

export const schema = {
  users,
  accounts,
  sessions,
  verificationTokens,
  links,
  linkVisits,
};
