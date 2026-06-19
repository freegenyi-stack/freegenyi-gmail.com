import { pgTable, serial, text, timestamp, integer, boolean, varchar, decimal, smallint, char, index, uniqueIndex, unique, jsonb } from "drizzle-orm/pg-core";

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
  lastSeenAt: timestamp("last_seen_at"),
  themeSettings: text("theme_settings"), // JSON string for theme choices
  avatarConfig: text("avatar_config"), // JSON string for avatar choices
  metadata: text("metadata"), // JSON string for role-specific data (School, NGO, Spouse, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const children = pgTable("children", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  familyId: text("family_id"),
  fullName: text("full_name").notNull(),
  birthDate: text("birth_date"), // date stored as string YYYY-MM-DD
  gender: text("gender"),
  educationLevel: text("education_level"),
  schoolId: integer("school_id"), // Reference to schools table (optional FK)
  schoolName: text("school_name"), // Cached name for display
  accessPinHash: text("access_pin_hash"),
  /** JSON — besoins, questionnaire, mode d'apprentissage, durée écran */
  learningProfile: text("learning_profile"),
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
  familyId: text("family_id"),
  invitedEmail: text("invited_email").notNull(),
  role: varchar("role", { length: 20 }).default("coparent"),
  token: text("token").unique(),
  status: varchar("status", { length: 20 }).default("pending"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const childDevicePairings = pgTable("child_device_pairings", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  deviceToken: text("device_token").notNull().unique(),
  deviceLabel: text("device_label"),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const childPairingCodes = pgTable("child_pairing_codes", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 20 }).default("direct"), // direct, group, channel
  name: text("name"),
  directKey: varchar("direct_key", { length: 64 }),
  schoolId: integer("school_id"),
  lastMessageAt: timestamp("last_message_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversationMembers = pgTable("conversation_members", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lastReadAt: timestamp("last_read_at"),
  muted: boolean("muted").default(false),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("conversation_members_pair_idx").on(table.conversationId, table.userId),
]);

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId: integer("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  messageType: varchar("message_type", { length: 20 }).default("text"),
  content: text("content"),
  mediaUrl: text("media_url"),
  mediaBlocked: boolean("media_blocked").default(false),
  moderatedAt: timestamp("moderated_at"),
  moderatedBy: integer("moderated_by").references(() => users.id, { onDelete: "set null" }),
  isHidden: boolean("is_hidden").default(false),
  reportCount: integer("report_count").notNull().default(0),
  isDeleted: boolean("is_deleted").default(false),
  editedAt: timestamp("edited_at"),
  reactions: text("reactions"),
  replyToMessageId: integer("reply_to_message_id"),
  pinnedAt: timestamp("pinned_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("chat_messages_conversation_idx").on(table.conversationId, table.createdAt),
  index("chat_messages_report_idx").on(table.reportCount, table.createdAt),
]);

export const chatMessageReports = pgTable("chat_message_reports", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull().references(() => chatMessages.id, { onDelete: "cascade" }),
  reporterId: integer("reporter_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("chat_message_reports_unique_idx").on(table.messageId, table.reporterId),
  index("chat_message_reports_message_idx").on(table.messageId),
]);

export const chatTyping = pgTable("chat_typing", {
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
}, (table) => [
  uniqueIndex("chat_typing_pair_idx").on(table.conversationId, table.userId),
  index("chat_typing_expires_idx").on(table.expiresAt),
]);

export const messageSuggestions = pgTable("message_suggestions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  targetUserId: integer("target_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  reasonKey: varchar("reason_key", { length: 64 }).notNull(),
  reasonParams: text("reason_params"),
  sortOrder: integer("sort_order").default(0),
  dismissed: boolean("dismissed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("message_suggestions_unique_idx").on(table.userId, table.targetUserId, table.reasonKey),
  index("message_suggestions_user_idx").on(table.userId, table.dismissed),
]);

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

/** Abonnements Web Push (PC, tablette, mobile PWA) */
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  userAgent: text("user_agent"),
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
  unique("district_code_unique").on(table.districtId, table.code),
  index("schools_district_id_idx").on(table.districtId),
]);

export const organizationVerifications = pgTable("organization_verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orgType: varchar("org_type", { length: 10 }).notNull(),
  trackingCode: varchar("tracking_code", { length: 30 }).notNull().unique(),
  institutionSubtype: varchar("institution_subtype", { length: 50 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  documents: text("documents"),
  rejectionReason: text("rejection_reason"),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: text("reviewed_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("org_verifications_user_id_idx").on(table.userId),
  index("org_verifications_status_idx").on(table.status),
]);

/** Mur pédagogique — partages enseignants (leçons, exercices, examens…) */
export const pedagogyShares = pgTable("pedagogy_shares", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  postType: varchar("post_type", { length: 20 }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  educationLevel: text("education_level").notNull(),
  subject: text("subject"),
  viewCount: integer("view_count").notNull().default(0),
  likeCount: integer("like_count").notNull().default(0),
  reportCount: integer("report_count").notNull().default(0),
  isHidden: boolean("is_hidden").notNull().default(false),
  /** Lien vers authoring_resources quand publié depuis Mon Atelier */
  authoringResourceId: integer("authoring_resource_id").references(() => authoringResources.id, { onDelete: "set null" }),
  isRemoved: boolean("is_removed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("pedagogy_shares_level_idx").on(table.educationLevel, table.createdAt),
  index("pedagogy_shares_author_idx").on(table.authorId, table.createdAt),
]);

export const pedagogyShareAttachments = pgTable("pedagogy_share_attachments", {
  id: serial("id").primaryKey(),
  shareId: integer("share_id").notNull().references(() => pedagogyShares.id, { onDelete: "cascade" }),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type"),
  fileSize: integer("file_size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pedagogyShareLikes = pgTable("pedagogy_share_likes", {
  id: serial("id").primaryKey(),
  shareId: integer("share_id").notNull().references(() => pedagogyShares.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("pedagogy_share_likes_unique_idx").on(table.shareId, table.userId),
]);

export const pedagogyShareComments = pgTable("pedagogy_share_comments", {
  id: serial("id").primaryKey(),
  shareId: integer("share_id").notNull().references(() => pedagogyShares.id, { onDelete: "cascade" }),
  authorId: integer("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  isHidden: boolean("is_hidden").notNull().default(false),
  reportCount: integer("report_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("pedagogy_share_comments_share_idx").on(table.shareId, table.createdAt),
]);

/** Actualités enseignant — fil éditorial */
export const teacherNewsArticles = pgTable("teacher_news_articles", {
  id: serial("id").primaryKey(),
  topic: varchar("topic", { length: 30 }).notNull(),
  interestTags: text("interest_tags"),
  titleFr: text("title_fr").notNull(),
  titleAr: text("title_ar").notNull(),
  excerptFr: text("excerpt_fr").notNull(),
  excerptAr: text("excerpt_ar").notNull(),
  bodyFr: text("body_fr"),
  bodyAr: text("body_ar"),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("teacher_news_published_idx").on(table.isPublished, table.publishedAt),
  index("teacher_news_topic_idx").on(table.topic),
]);

export const teacherNewsReads = pgTable("teacher_news_reads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  articleId: integer("article_id").notNull().references(() => teacherNewsArticles.id, { onDelete: "cascade" }),
  readAt: timestamp("read_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("teacher_news_reads_unique_idx").on(table.userId, table.articleId),
]);

/** Commentaires actualités — parents & enseignants (modération auto par signalements) */
export const newsArticleComments = pgTable("news_article_comments", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").notNull().references(() => teacherNewsArticles.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  parentId: integer("parent_id"),
  body: text("body").notNull().default(""),
  attachmentType: varchar("attachment_type", { length: 20 }).notNull().default("none"),
  attachmentUrl: text("attachment_url"),
  attachmentSticker: text("attachment_sticker"),
  likeCount: integer("like_count").notNull().default(0),
  isHidden: boolean("is_hidden").notNull().default(false),
  reportCount: integer("report_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("news_comments_article_idx").on(table.articleId, table.createdAt),
  index("news_comments_user_idx").on(table.userId),
  index("news_comments_parent_idx").on(table.parentId),
]);

export const newsCommentLikes = pgTable("news_comment_likes", {
  id: serial("id").primaryKey(),
  commentId: integer("comment_id").notNull().references(() => newsArticleComments.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("news_comment_likes_unique_idx").on(table.commentId, table.userId),
  index("news_comment_likes_user_idx").on(table.userId),
]);

/** Bibliothèque numérique — catalogue local (sync Calibre-Web plus tard) */
export const libraryBooks = pgTable("library_books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author"),
  description: text("description"),
  format: varchar("format", { length: 10 }).notNull().default("epub"),
  fileUrl: text("file_url"),
  coverUrl: text("cover_url"),
  ageMin: smallint("age_min"),
  ageMax: smallint("age_max"),
  subject: text("subject"),
  language: varchar("language", { length: 8 }).default("fr"),
  /** teachers | parents | family */
  audience: varchar("audience", { length: 20 }).notNull().default("family"),
  isPublished: boolean("is_published").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  pageCount: smallint("page_count"),
  calibreId: text("calibre_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("library_books_published_idx").on(table.isPublished, table.createdAt),
  index("library_books_subject_idx").on(table.subject),
  index("library_books_featured_idx").on(table.isFeatured, table.isPublished, table.createdAt),
]);

export const libraryReadingProgress = pgTable("library_reading_progress", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  bookId: integer("book_id").notNull().references(() => libraryBooks.id, { onDelete: "cascade" }),
  location: text("location"),
  locatorJson: text("locator_json"),
  percent: smallint("percent").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("library_progress_child_book_idx").on(table.childId, table.bookId),
]);

export const libraryBookmarks = pgTable("library_bookmarks", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  bookId: integer("book_id").notNull().references(() => libraryBooks.id, { onDelete: "cascade" }),
  locatorJson: text("locator_json").notNull(),
  label: text("label"),
  noteText: text("note_text"),
  kind: varchar("kind", { length: 20 }).notNull().default("bookmark"),
  color: varchar("color", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("library_bookmarks_child_book_idx").on(table.childId, table.bookId, table.createdAt),
]);

export const libraryAssignments = pgTable("library_assignments", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull().references(() => libraryBooks.id, { onDelete: "cascade" }),
  teacherId: integer("teacher_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  childId: integer("child_id").references(() => children.id, { onDelete: "cascade" }),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Progression lecture adulte (parent hobby / enseignant) */
export const libraryUserProgress = pgTable("library_user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookId: integer("book_id").notNull().references(() => libraryBooks.id, { onDelete: "cascade" }),
  locatorJson: text("locator_json"),
  percent: smallint("percent").notNull().default(0),
  status: varchar("status", { length: 20 }).notNull().default("reading"),
  pagesRead: integer("pages_read").notNull().default(0),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  finishedAt: timestamp("finished_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("library_user_progress_user_book_idx").on(table.userId, table.bookId),
]);

export const libraryUserAnnotations = pgTable("library_user_annotations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookId: integer("book_id").notNull().references(() => libraryBooks.id, { onDelete: "cascade" }),
  locatorJson: text("locator_json").notNull(),
  label: text("label"),
  noteText: text("note_text"),
  kind: varchar("kind", { length: 20 }).notNull().default("bookmark"),
  color: varchar("color", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("library_user_annotations_user_book_idx").on(table.userId, table.bookId, table.createdAt),
]);

export const libraryReviews = pgTable("library_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookId: integer("book_id").notNull().references(() => libraryBooks.id, { onDelete: "cascade" }),
  rating: smallint("rating").notNull(),
  comment: text("comment"),
  visibility: varchar("visibility", { length: 20 }).notNull().default("private"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("library_reviews_user_book_idx").on(table.userId, table.bookId),
  index("library_reviews_book_visibility_idx").on(table.bookId, table.visibility, table.createdAt),
]);

export const libraryReadingSessions = pgTable("library_reading_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookId: integer("book_id").notNull().references(() => libraryBooks.id, { onDelete: "cascade" }),
  childId: integer("child_id").references(() => children.id, { onDelete: "set null" }),
  pagesDelta: integer("pages_delta").notNull().default(0),
  durationSec: integer("duration_sec").notNull().default(0),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
}, (table) => [
  index("library_reading_sessions_user_started_idx").on(table.userId, table.startedAt),
]);

export const libraryBookAnnexes = pgTable("library_book_annexes", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull().references(() => libraryBooks.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  kind: varchar("kind", { length: 30 }).notNull().default("link"),
  sortOrder: smallint("sort_order").notNull().default(0),
}, (table) => [
  index("library_book_annexes_book_idx").on(table.bookId, table.sortOrder),
]);

export const libraryQuizzes = pgTable("library_quizzes", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull().references(() => libraryBooks.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("library_quizzes_book_idx").on(table.bookId),
]);

export const libraryQuizQuestions = pgTable("library_quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull().references(() => libraryQuizzes.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  optionsJson: text("options_json").notNull(),
  correctIndex: smallint("correct_index").notNull().default(0),
  sortOrder: smallint("sort_order").notNull().default(0),
});

export const libraryQuizAttempts = pgTable("library_quiz_attempts", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  quizId: integer("quiz_id").notNull().references(() => libraryQuizzes.id, { onDelete: "cascade" }),
  bookId: integer("book_id").notNull().references(() => libraryBooks.id, { onDelete: "cascade" }),
  score: smallint("score").notNull(),
  total: smallint("total").notNull(),
  answersJson: text("answers_json"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("library_quiz_attempts_child_idx").on(table.childId, table.createdAt),
]);

export const libraryReadingBadges = pgTable("library_reading_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  childId: integer("child_id").references(() => children.id, { onDelete: "cascade" }),
  badgeKey: varchar("badge_key", { length: 40 }).notNull(),
  label: text("label").notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
}, (table) => [
  index("library_reading_badges_user_idx").on(table.userId, table.earnedAt),
  index("library_reading_badges_child_idx").on(table.childId, table.earnedAt),
]);

export const libraryOfflineDownloads = pgTable("library_offline_downloads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  childId: integer("child_id").references(() => children.id, { onDelete: "cascade" }),
  bookId: integer("book_id").notNull().references(() => libraryBooks.id, { onDelete: "cascade" }),
  weekStart: timestamp("week_start", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("contact_submissions_status_idx").on(table.status, table.createdAt),
]);

export const appSettings = pgTable("app_settings", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const teacherCourses = pgTable("teacher_courses", {
  id: serial("id").primaryKey(),
  kind: varchar("kind", { length: 20 }).notNull().default("direct"),
  slug: text("slug").notNull().unique(),
  titleFr: text("title_fr").notNull(),
  titleAr: text("title_ar").notNull(),
  durationLabel: text("duration_label"),
  durationMinutes: integer("duration_minutes"),
  difficultyLevel: integer("difficulty_level").notNull().default(1),
  tagFr: text("tag_fr"),
  tagAr: text("tag_ar"),
  totalEpisodes: integer("total_episodes").notNull().default(1),
  externalUrl: text("external_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teacherCourseProgress = pgTable("teacher_course_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => teacherCourses.id, { onDelete: "cascade" }),
  episode: integer("episode").notNull().default(1),
  percent: integer("percent").notNull().default(0),
  completedAt: timestamp("completed_at"),
  certificateCode: text("certificate_code"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("teacher_course_progress_user_course_idx").on(table.userId, table.courseId),
]);

export const teacherDocuments = pgTable("teacher_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  templateId: text("template_id").notNull(),
  title: text("title").notNull(),
  contentJson: text("content_json").notNull().default("{}"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("teacher_documents_user_idx").on(table.userId, table.updatedAt),
]);

/** Mon Atelier — dossiers (enseignant aujourd'hui, parent demain) */
export const authoringFolders = pgTable("authoring_folders", {
  id: serial("id").primaryKey(),
  ownerUserId: integer("owner_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  ownerRole: varchar("owner_role", { length: 20 }).notNull().default("enseignant"),
  name: text("name").notNull(),
  parentId: integer("parent_id"),
  schoolYear: varchar("school_year", { length: 12 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("authoring_folders_owner_idx").on(table.ownerUserId, table.ownerRole, table.createdAt),
]);

/** Mon Atelier — documents TipTap + activités H5P */
export const authoringResources = pgTable("authoring_resources", {
  id: serial("id").primaryKey(),
  ownerUserId: integer("owner_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  ownerRole: varchar("owner_role", { length: 20 }).notNull().default("enseignant"),
  kind: varchar("kind", { length: 20 }).notNull(),
  title: text("title").notNull(),
  resourceType: varchar("resource_type", { length: 40 }).notNull().default("other"),
  subject: text("subject"),
  schoolLevel: text("school_level"),
  schoolYear: varchar("school_year", { length: 12 }),
  folderId: integer("folder_id").references(() => authoringFolders.id, { onDelete: "set null" }),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  contentJson: text("content_json").notNull().default("{}"),
  h5pContentId: varchar("h5p_content_id", { length: 128 }),
  h5pLibrary: text("h5p_library"),
  templateId: text("template_id"),
  tags: text("tags"),
  legacyDocumentId: integer("legacy_document_id").references(() => teacherDocuments.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("authoring_resources_owner_idx").on(table.ownerUserId, table.ownerRole, table.updatedAt),
  index("authoring_resources_kind_idx").on(table.kind, table.status, table.updatedAt),
  index("authoring_resources_search_idx").on(table.ownerUserId, table.resourceType, table.subject),
]);

export const authoringAssignments = pgTable("authoring_assignments", {
  id: serial("id").primaryKey(),
  resourceId: integer("resource_id").notNull().references(() => authoringResources.id, { onDelete: "cascade" }),
  assignedByUserId: integer("assigned_by_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  childId: integer("child_id").references(() => children.id, { onDelete: "cascade" }),
  note: text("note"),
  targetType: varchar("target_type", { length: 20 }).notNull().default("class"),
  targetJson: text("target_json"),
  dueAt: timestamp("due_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("authoring_assignments_resource_idx").on(table.resourceId, table.createdAt),
  index("authoring_assignments_teacher_idx").on(table.assignedByUserId, table.createdAt),
]);

export const authoringProgress = pgTable("authoring_progress", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => authoringAssignments.id, { onDelete: "cascade" }),
  childId: integer("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  score: integer("score"),
  xpEarned: integer("xp_earned"),
  stars: integer("stars"),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("authoring_progress_child_idx").on(table.childId, table.status, table.updatedAt),
  index("authoring_progress_assignment_idx").on(table.assignmentId, table.status),
]);

/** Tentatives élèves (assignation, mur, atelier) — trace scores pour l'enseignant */
export const authoringActivityAttempts = pgTable("authoring_activity_attempts", {
  id: serial("id").primaryKey(),
  resourceId: integer("resource_id").notNull().references(() => authoringResources.id, { onDelete: "cascade" }),
  teacherUserId: integer("teacher_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  childId: integer("child_id").references(() => children.id, { onDelete: "set null" }),
  submittedByUserId: integer("submitted_by_user_id").references(() => users.id, { onDelete: "set null" }),
  progressId: integer("progress_id").references(() => authoringProgress.id, { onDelete: "set null" }),
  shareId: integer("share_id").references(() => pedagogyShares.id, { onDelete: "set null" }),
  source: varchar("source", { length: 20 }).notNull().default("assignment"),
  score: integer("score").notNull(),
  xpEarned: integer("xp_earned"),
  stars: integer("stars"),
  errors: integer("errors"),
  durationSeconds: integer("duration_seconds"),
  answersJson: jsonb("answers_json"),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
}, (table) => [
  index("authoring_attempts_teacher_idx").on(table.teacherUserId, table.completedAt),
  index("authoring_attempts_resource_idx").on(table.resourceId, table.completedAt),
  index("authoring_attempts_child_idx").on(table.childId, table.completedAt),
]);

/** Usine curriculum — bundles importés depuis curriculum/countries/ */
export const curriculumBundles = pgTable("curriculum_bundles", {
  id: serial("id").primaryKey(),
  countryCode: char("country_code", { length: 2 }).notNull(),
  levelCode: varchar("level_code", { length: 8 }).notNull(),
  subjectCode: varchar("subject_code", { length: 32 }).notNull(),
  moduleId: varchar("module_id", { length: 64 }).notNull(),
  version: integer("version").notNull().default(1),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  sourceHash: varchar("source_hash", { length: 64 }),
  snapshotJson: jsonb("snapshot_json").notNull(),
  importedAt: timestamp("imported_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("curriculum_bundles_unique").on(
    table.countryCode,
    table.levelCode,
    table.subjectCode,
    table.version
  ),
]);

export const curriculumNodes = pgTable("curriculum_nodes", {
  id: serial("id").primaryKey(),
  bundleId: integer("bundle_id").notNull().references(() => curriculumBundles.id, { onDelete: "cascade" }),
  nodeId: varchar("node_id", { length: 64 }).notNull(),
  competencyId: varchar("competency_id", { length: 64 }).notNull(),
  domaine: varchar("domaine", { length: 32 }),
  sortOrder: integer("sort_order").notNull().default(0),
  titleFr: text("title_fr").notNull(),
  titleAr: text("title_ar"),
  metaJson: jsonb("meta_json"),
}, (table) => [
  uniqueIndex("curriculum_nodes_bundle_node").on(table.bundleId, table.nodeId),
  index("curriculum_nodes_competency_idx").on(table.bundleId, table.competencyId),
]);

export const curriculumExercises = pgTable("curriculum_exercises", {
  id: serial("id").primaryKey(),
  bundleId: integer("bundle_id").notNull().references(() => curriculumBundles.id, { onDelete: "cascade" }),
  itemId: varchar("item_id", { length: 64 }).notNull(),
  competencyId: varchar("competency_id", { length: 64 }).notNull(),
  variantGroup: varchar("variant_group", { length: 64 }).notNull(),
  itemJson: jsonb("item_json").notNull(),
}, (table) => [
  uniqueIndex("curriculum_exercises_bundle_item").on(table.bundleId, table.itemId),
  index("curriculum_exercises_competency_idx").on(table.bundleId, table.competencyId),
]);

export const curriculumChildProgress = pgTable("curriculum_child_progress", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  bundleId: integer("bundle_id").notNull().references(() => curriculumBundles.id, { onDelete: "cascade" }),
  competencyId: varchar("competency_id", { length: 64 }).notNull(),
  stars: smallint("stars").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
  status: varchar("status", { length: 20 }).notNull().default("available"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("curriculum_child_progress_unique").on(table.childId, table.bundleId, table.competencyId),
  index("curriculum_child_progress_child_idx").on(table.childId, table.updatedAt),
]);

export const curriculumSessions = pgTable("curriculum_sessions", {
  id: serial("id").primaryKey(),
  sessionKey: varchar("session_key", { length: 64 }).notNull().unique(),
  childId: integer("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  bundleId: integer("bundle_id").references(() => curriculumBundles.id, { onDelete: "set null" }),
  source: varchar("source", { length: 24 }).notNull(),
  competencyId: varchar("competency_id", { length: 64 }).notNull(),
  maqtaId: varchar("maqta_id", { length: 16 }),
  payloadJson: jsonb("payload_json").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  score: integer("score"),
  xpEarned: integer("xp_earned"),
  answersJson: jsonb("answers_json"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("curriculum_sessions_child_idx").on(table.childId, table.status, table.createdAt),
]);

export const curriculumAssignments = pgTable("curriculum_assignments", {
  id: serial("id").primaryKey(),
  sessionKey: varchar("session_key", { length: 64 }).notNull(),
  childId: integer("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  assignedByUserId: integer("assigned_by_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  assignedByRole: varchar("assigned_by_role", { length: 16 }).notNull(),
  maqtaId: varchar("maqta_id", { length: 16 }),
  subjectCode: varchar("subject_code", { length: 32 }).notNull(),
  competencyId: varchar("competency_id", { length: 64 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  index("curriculum_assignments_child_idx").on(table.childId, table.status, table.assignedAt),
  index("curriculum_assignments_teacher_idx").on(table.assignedByUserId, table.assignedAt),
]);
