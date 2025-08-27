import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  users, 
  documents, 
  documentAnalysis, 
  clauses,
  chatConversations,
  chatMessages 
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<any>;
  getUserByEmail(email: string): Promise<any>;
  createUser(userData: any): Promise<any>;
  upsertUser(userData: any): Promise<any>;
  updateUserDocumentCount(userId: string, count: number): Promise<any>;
  
  // Documents
  createDocument(documentData: any): Promise<any>;
  getUserDocuments(userId: string): Promise<any[]>;
  getDocument(id: string): Promise<any>;
  updateDocumentStatus(id: string, status: string): Promise<void>;
  
  // Document Analysis
  createDocumentAnalysis(analysisData: any): Promise<any>;
  getDocumentAnalysis(documentId: string): Promise<any>;
  
  // Clauses
  createClause(clauseData: any): Promise<any>;
  getDocumentClauses(documentId: string): Promise<any[]>;
  
  // Dashboard Stats
  getDashboardStats(userId: string): Promise<any>;
  
  // Chat
  createChatConversation(conversationData: any): Promise<any>;
  getUserChatConversations(userId: string): Promise<any[]>;
  getConversationMessages(conversationId: string): Promise<any[]>;
  createChatMessage(messageData: any): Promise<any>;
  getChatMessages(conversationId: string): Promise<any[]>;
  
  // Glossary
  getAllGlossaryTerms(): Promise<any[]>;
  getGlossaryTerm(term: string): Promise<any>;
}

class DatabaseStorage implements IStorage {
  async getUser(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(userData: any) {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async upsertUser(userData: any) {
    const existingUser = await this.getUser(userData.id);
    if (existingUser) {
      const result = await db
        .update(users)
        .set({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date()
        })
        .where(eq(users.id, userData.id))
        .returning();
      return result[0];
    } else {
      return await this.createUser(userData);
    }
  }

  async updateUserDocumentCount(userId: string, count: number) {
    const result = await db
      .update(users)
      .set({ documentsUploaded: count })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async createDocument(documentData: any) {
    const result = await db.insert(documents).values(documentData).returning();
    return result[0];
  }

  async getUserDocuments(userId: string) {
    return await db.select().from(documents).where(eq(documents.userId, userId));
  }

  async getDocument(id: string) {
    const result = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
    return result[0];
  }

  async updateDocumentStatus(id: string, status: string) {
    await db.update(documents).set({ status }).where(eq(documents.id, id));
  }

  async createDocumentAnalysis(analysisData: any) {
    const result = await db.insert(documentAnalysis).values(analysisData).returning();
    return result[0];
  }

  async getDocumentAnalysis(documentId: string) {
    const result = await db
      .select()
      .from(documentAnalysis)
      .where(eq(documentAnalysis.documentId, documentId))
      .limit(1);
    return result[0];
  }

  async createClause(clauseData: any) {
    const result = await db.insert(clauses).values(clauseData).returning();
    return result[0];
  }

  async getDocumentClauses(documentId: string) {
    return await db
      .select()
      .from(clauses)
      .where(eq(clauses.documentId, documentId))
      .orderBy(clauses.position);
  }

  async getDashboardStats(userId: string) {
    const userDocs = await this.getUserDocuments(userId);
    const analysisResults = await Promise.all(
      userDocs.map(doc => this.getDocumentAnalysis(doc.id))
    );

    const totalDocuments = userDocs.length;
    const documentsAnalyzed = userDocs.filter(doc => doc.status === 'analyzed').length;
    
    let risksIdentified = 0;
    let pendingDeadlines = 0;

    analysisResults.forEach(analysis => {
      if (analysis) {
        risksIdentified += (Array.isArray(analysis.risks) ? analysis.risks.length : 0);
        pendingDeadlines += (Array.isArray(analysis.deadlines) ? analysis.deadlines.length : 0);
      }
    });

    return {
      totalDocuments,
      documentsAnalyzed,
      risksIdentified,
      pendingDeadlines
    };
  }

  async createChatConversation(conversationData: any) {
    const result = await db.insert(chatConversations).values(conversationData).returning();
    return result[0];
  }

  async getUserChatConversations(userId: string) {
    return await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.userId, userId))
      .orderBy(chatConversations.updatedAt);
  }

  async createChatMessage(messageData: any) {
    const result = await db.insert(chatMessages).values(messageData).returning();
    return result[0];
  }

  async getConversationMessages(conversationId: string) {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(chatMessages.createdAt);
  }

  async getChatMessages(conversationId: string) {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(chatMessages.createdAt);
  }

  async getAllGlossaryTerms() {
    // For now return empty array, can be implemented later
    return [];
  }

  async getGlossaryTerm(term: string) {
    // For now return null, can be implemented later
    return null;
  }
}

export const storage: IStorage = new DatabaseStorage();