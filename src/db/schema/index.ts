import { mysqlTable, int, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  nama: varchar('nama', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sessions = mysqlTable('sessions', {
  id: int('id').primaryKey().autoincrement(),
  token: varchar('token', { length: 255 }).notNull(),
  user_id: int('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});
