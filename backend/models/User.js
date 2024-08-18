const { pgTable, serial, varchar, timestamp } = require('drizzle-orm/pg-core');

const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', 255).notNull(),
    email: varchar('email', 255).notNull().unique(),
    password: varchar('password', 255).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
});

module.exports = users;
