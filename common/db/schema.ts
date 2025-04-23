import {
  bigint,
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel, InferEnum } from 'drizzle-orm'

export const userRole = pgEnum("UserRole", ["ADMIN", "SELLER", "USER"]);
export const dealType = pgEnum("DealType", ["HOT", "HIT", "NONE"]);
export const category = pgEnum("Category", [
  "Electronics",
  "Fashion",
  "Sport",
  "Toys_and_hobbies",
  "Health",
]);

export type Category = InferEnum<typeof category>
export type DealType = InferEnum<typeof dealType>
export type UserRole = InferEnum<typeof userRole>

export const example = pgTable("example", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified"),
  image: text("image"),
});
export type User = InferSelectModel<typeof user>

export const account = pgTable(
  "account",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
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
  (t) => [unique("uniqueProviderAccount").on(t.provider, t.providerAccountId)]
);

export const session = pgTable("session", {
  sessionToken: text("session_token").notNull().unique().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const verificationToken = pgTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires").notNull(),
  },
  (t) => [unique("verification_token_uniq").on(t.identifier, t.token)]
);

export const product = pgTable("product", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  stock: integer("stock").notNull(),
  price: numeric("price", { mode: "number" }).notNull(),
  previewImageUrl: text("preview_image_url").notNull(),
  images: text("images").array().notNull(),
  dealType: dealType("deal_type").notNull(),
  shippingTime: integer("shipping_time").notNull(),
  views: bigint("views", { mode: "number" }).notNull(),
  boughtCount: bigint("bought_count", { mode: "number" }).notNull(),
  lastBoughtAt: timestamp("last_bought_at").defaultNow(),
  rating: integer("rating").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  categories: category("categories").array().notNull(),
});

export type Product = InferSelectModel<typeof product>
export type ProductNew = InferInsertModel<typeof product>

export const conversation = pgTable("conversation", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_ud")
    .notNull()
    .references(() => user.id),
});

export const chatMessage = pgTable("chat_message", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  seen: boolean("seen").default(false),
  onwerId: uuid("owner_id")
    .notNull()
    .references(() => user.id),
  conversationId: bigint("conversation_id", { mode: "number" }).references(
    () => conversation.id
  ),
});
