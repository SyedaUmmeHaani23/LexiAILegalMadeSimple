import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  documentsUploaded: integer("documents_uploaded").default(0),
  isPaidUser: boolean("is_paid_user").default(false),
  subscriptionTier: varchar("subscription_tier").default("free"), // free, pro, enterprise
  isEmailVerified: boolean("is_email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Documents table
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  fileName: varchar("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  fileType: varchar("file_type").notNull(),
  filePath: varchar("file_path").notNull(),
  status: varchar("status").notNull().default("processing"), // processing, analyzed, error
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document analysis results
export const documentAnalysis = pgTable("document_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").references(() => documents.id).notNull(),
  summary: text("summary").notNull(),
  riskLevel: varchar("risk_level").notNull(), // low, medium, high
  obligations: jsonb("obligations"), // Array of obligation objects
  risks: jsonb("risks"), // Array of risk objects  
  deadlines: jsonb("deadlines"), // Array of deadline objects
  createdAt: timestamp("created_at").defaultNow(),
});

// Document clauses
export const clauses = pgTable("clauses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").references(() => documents.id).notNull(),
  originalText: text("original_text").notNull(),
  simplifiedText: text("simplified_text").notNull(),
  clauseType: varchar("clause_type").notNull(), // obligation, risk, deadline, neutral
  riskLevel: varchar("risk_level"), // low, medium, high (for risk clauses)
  explanation: text("explanation").notNull(),
  actionableAdvice: text("actionable_advice"),
  position: integer("position").notNull(), // Order in document
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat conversations
export const chatConversations = pgTable("chat_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  documentId: varchar("document_id").references(() => documents.id),
  title: varchar("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => chatConversations.id).notNull(),
  role: varchar("role").notNull(), // user, assistant
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Legal glossary terms
export const glossaryTerms = pgTable("glossary_terms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  term: varchar("term").notNull().unique(),
  definition: text("definition").notNull(),
  simplifiedDefinition: text("simplified_definition").notNull(),
  category: varchar("category"), // contract, property, corporate, etc.
  examples: jsonb("examples"), // Array of example usage
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertDocument = typeof documents.$inferInsert;
export type Document = typeof documents.$inferSelect;

export type InsertDocumentAnalysis = typeof documentAnalysis.$inferInsert;
export type DocumentAnalysis = typeof documentAnalysis.$inferSelect;

export type InsertClause = typeof clauses.$inferInsert;
export type Clause = typeof clauses.$inferSelect;

export type InsertChatConversation = typeof chatConversations.$inferInsert;
export type ChatConversation = typeof chatConversations.$inferSelect;

export type InsertChatMessage = typeof chatMessages.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertGlossaryTerm = typeof glossaryTerms.$inferInsert;
export type GlossaryTerm = typeof glossaryTerms.$inferSelect;

// Validation schemas
export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertGlossaryTermSchema = createInsertSchema(glossaryTerms).omit({
  id: true,
  createdAt: true,
});
