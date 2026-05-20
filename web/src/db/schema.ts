import { pgTable, serial, text, timestamp, integer, boolean, varchar, decimal, smallint, char, index, uniqueIndex, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").unique(),
  passwordHash: text("password_hash"),
  fullName: text("full_name"),
  phone: text("phone"),
  image: text("image"), // Photo de profil Google/Avatar
  role: varchar("role", { length: 20 }).default("parent"),
  emailVerified: timestamp("email_verified"), // timestamp pour NextAuth (null = non vérifié)
  verificationToken: text("verification_token"),
  verificationTokenExpiresAt: timestamp("verification_token_expires_at"),
  familyId: text("family_id"),
  onboardingStep: integer("onboarding_step").default(1),
  loginAttempts: integer("login_attempts").default(0),
  lockedUntil: timestamp("locked_until"),
  lastLoginAt: timestamp("last_login_at"),
  themeSettings: text("theme_settings"), // JSON string for theme choices
  avatarConfig: text("avatar_config"), // JSON string for avatar choices
  metadata: text("metadata"), // JSON string for role-specific data (School, NGO, Spouse, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const children = pgTable("children", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  birthDate: text("birth_date"), // date stored as string YYYY-MM-DD
  gender: text("gender"),
  educationLevel: text("education_level"),
  schoolId: integer("school_id"), // Reference to schools table (optional FK)
  schoolName: text("school_name"), // Cached name for display
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 50 }).notNull(), // 'auth', 'course', 'exercise', 'search', 'invite'
  action: text("action").notNull(),
  metadata: text("metadata"), // JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  invitedEmail: text("invited_email").notNull(),
  role: varchar("role", { length: 20 }).default("papa"),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 20 }).default("direct"), // direct, group, ai
  name: text("name"), // For group chats
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversationMembers = pgTable("conversation_members", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId: integer("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  messageType: varchar("message_type", { length: 20 }).default("text"), // text, image, audio, file
  content: text("content"),
  mediaUrl: text("media_url"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // message, achievement, system
  title: text("title").notNull(),
  content: text("content"),
  link: text("link"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================
// SCHOOL DATABASE — Countries → Regions → Districts → Schools
// ============================================================

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  code: char("code", { length: 2 }).notNull().unique(),
  nameFr: varchar("name_fr", { length: 100 }).notNull(),
  nameAr: varchar("name_ar", { length: 100 }),
  nameEn: varchar("name_en", { length: 100 }).notNull(),
  nameLocal: varchar("name_local", { length: 100 }),
  flagEmoji: varchar("flag_emoji", { length: 10 }),
  langs: varchar("langs", { length: 20 }).notNull().default("fr"),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  countryCode: char("country_code", { length: 2 }).notNull().references(() => countries.code, { onDelete: "cascade" }),
  code: varchar("code", { length: 10 }).notNull(),
  nameLocal: varchar("name_local", { length: 200 }).notNull(),
  nameFr: varchar("name_fr", { length: 200 }),
  nameEn: varchar("name_en", { length: 200 }),
});

export const districts = pgTable("districts", {
  id: serial("id").primaryKey(),
  regionId: integer("region_id").notNull().references(() => regions.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 10 }).notNull(),
  nameLocal: varchar("name_local", { length: 200 }).notNull(),
  nameFr: varchar("name_fr", { length: 200 }),
  nameEn: varchar("name_en", { length: 200 }),
});

export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  districtId: integer("district_id").notNull().references(() => districts.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 20 }),
  nameLocal: varchar("name_local", { length: 400 }).notNull(), // Arabic name
  nameFr: varchar("name_fr", { length: 400 }),                 // French translation
  nameEn: varchar("name_en", { length: 400 }),
  type: smallint("type").notNull().default(1),                 // 1=public, 2=privé
  isActive: boolean("is_active").default(true),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  translationStatus: varchar("translation_status", { length: 20 }).default("needs_review"),
  source: varchar("source", { length: 100 }).default("awlyaa.education.dz"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  unique("district_code_unique").on(table.districtId, table.code)
]);
