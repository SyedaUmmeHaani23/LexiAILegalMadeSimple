import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, optionalAuth } from "./auth";
import type { AuthRequest } from "./auth";
import { documentService } from "./services/documentService";
import { pdfService } from "./services/pdfService";
import { answerLegalQuestion } from "./openai";
import { insertChatMessageSchema } from "@shared/schema";
import { translateText, translateAnalysisResults, translateClauses, SUPPORTED_LANGUAGES } from "./translation";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word documents, and text files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Note: Auth routes are handled in setupAuth()

  // Document download route
  app.get('/api/documents/:id/download', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const documentId = req.params.id;
      const userId = req.user!.id;

      const document = await storage.getDocument(documentId, userId);
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }

      const filePath = document.filePath;
      const fs = await import('fs');
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found on server' });
      }

      // Set appropriate headers
      res.setHeader('Content-Type', document.fileType);
      res.setHeader('Content-Disposition', `inline; filename="${document.fileName}"`);
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
    } catch (error) {
      console.error('File download error:', error);
      res.status(500).json({ message: 'Failed to download file' });
    }
  });

  // Document routes
  app.post('/api/documents/upload', isAuthenticated, upload.single('document'), async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const file = req.file;
      const { title } = req.body;

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      if (!title) {
        return res.status(400).json({ message: 'Document title is required' });
      }

      const result = await documentService.processUploadedDocument(userId, file, title);
      
      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }

      // Track document count for stats
      const user = await storage.getUser(userId);
      if (user) {
        await storage.updateUserDocumentCount(userId, (user.documentsUploaded || 0) + 1);
      }

      res.json({ 
        message: 'Document uploaded and analysis started',
        documentId: result.documentId 
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Failed to upload document' });
    }
  });

  app.get('/api/documents', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const documents = await storage.getUserDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ message: 'Failed to fetch documents' });
    }
  });

  // Get supported languages
  app.get('/api/languages', async (req, res) => {
    res.json(SUPPORTED_LANGUAGES);
  });

  // Translate UI content
  app.post('/api/translate-ui', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const { content, targetLanguage } = req.body;
      
      if (!content || !targetLanguage || targetLanguage === 'en') {
        return res.json({ translatedContent: content });
      }

      const translatedContent = await translateText(content, targetLanguage);
      res.json({ translatedContent });
    } catch (error) {
      console.error('UI translation error:', error);
      res.status(500).json({ message: 'Failed to translate UI content' });
    }
  });

  app.get('/api/documents/:id', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const documentId = req.params.id;
      
      const language = req.query.lang as string || 'en';
      const result = await documentService.getDocumentWithAnalysis(documentId, userId);
      
      if (!result) {
        return res.status(404).json({ message: 'Document not found' });
      }

      // Translate if requested language is not English
      if (language !== 'en' && result.analysis) {
        result.analysis = await translateAnalysisResults(result.analysis, language);
      }

      if (language !== 'en' && result.clauses) {
        result.clauses = await translateClauses(result.clauses, language);
      }

      res.json(result);
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({ message: 'Failed to fetch document' });
    }
  });

  // Chat routes
  app.get('/api/chat/conversations', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const conversations = await storage.getUserChatConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ message: 'Failed to fetch conversations' });
    }
  });

  app.post('/api/chat/conversations', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const { title, documentId } = req.body;

      const conversation = await storage.createChatConversation({
        userId,
        documentId: documentId || null,
        title: title || 'New Conversation'
      });

      res.json(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ message: 'Failed to create conversation' });
    }
  });

  app.get('/api/chat/conversations/:id/messages', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const conversationId = req.params.id;
      const messages = await storage.getConversationMessages(conversationId);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  app.post('/api/chat/conversations/:id/messages', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const conversationId = req.params.id;
      const { content } = req.body;

      // Validate input
      const messageData = insertChatMessageSchema.parse({
        conversationId,
        role: 'user',
        content
      });

      // Save user message
      const userMessage = await storage.createChatMessage(messageData);

      // Get conversation and document context
      const messages = await storage.getConversationMessages(conversationId);
      const conversation = await storage.getUserChatConversations(req.user!.id);
      const currentConv = conversation.find(c => c.id === conversationId);
      
      let documentContext = '';
      if (currentConv?.documentId) {
        const docResult = await documentService.getDocumentWithAnalysis(currentConv.documentId, req.user!.id);
        if (docResult) {
          documentContext = `Document: ${docResult.document.title}\nSummary: ${docResult.analysis?.summary || ''}\n`;
          if (docResult.clauses) {
            documentContext += 'Key Clauses:\n' + docResult.clauses.map(c => c.originalText).join('\n\n');
          }
        }
      }

      // Prepare conversation history for AI
      const conversationHistory = messages
        .filter(m => m.id !== userMessage.id) // Exclude the just-sent message
        .map((m: any) => ({ role: m.role, content: m.content }));

      // Get AI response with optional translation
      const language = req.query.lang as string || 'en';
      let aiResponse = await answerLegalQuestion(content, documentContext, conversationHistory);
      
      // Translate AI response if needed
      if (language !== 'en') {
        aiResponse = await translateText(aiResponse, language);
      }

      // Save AI response
      const aiMessage = await storage.createChatMessage({
        conversationId,
        role: 'assistant',
        content: aiResponse
      });

      res.json({
        userMessage,
        aiMessage
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  // Glossary routes
  app.get('/api/glossary', async (req, res) => {
    try {
      const terms = await storage.getAllGlossaryTerms();
      res.json(terms);
    } catch (error) {
      console.error('Error fetching glossary:', error);
      res.status(500).json({ message: 'Failed to fetch glossary terms' });
    }
  });

  app.get('/api/glossary/:term', async (req, res) => {
    try {
      const term = await storage.getGlossaryTerm(req.params.term);
      if (!term) {
        return res.status(404).json({ message: 'Term not found' });
      }
      res.json(term);
    } catch (error) {
      console.error('Error fetching term:', error);
      res.status(500).json({ message: 'Failed to fetch term' });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const documents = await storage.getUserDocuments(userId);
      
      const stats = {
        documentsAnalyzed: documents.filter(d => d.status === 'analyzed').length,
        totalDocuments: documents.length,
        risksIdentified: 0, // Would calculate from analysis data
        pendingDeadlines: 0 // Would calculate from deadline data
      };

      // Calculate risks and deadlines from document analyses
      for (const doc of documents) {
        if (doc.status === 'analyzed') {
          const analysis = await storage.getDocumentAnalysis(doc.id);
          if (analysis) {
            const risks = analysis.risks as any[] || [];
            const deadlines = analysis.deadlines as any[] || [];
            stats.risksIdentified += risks.length;
            stats.pendingDeadlines += deadlines.length;
          }
        }
      }

      res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
  });

  // PDF download route
  app.get('/api/documents/:id/download', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const documentId = req.params.id;
      
      // Get document and verify ownership
      const result = await documentService.getDocumentWithAnalysis(documentId, userId);
      if (!result) {
        return res.status(404).json({ message: 'Document not found' });
      }

      // Generate PDF report
      const pdfPath = await pdfService.generateAnalysisReport({
        document: result.document,
        analysis: result.analysis,
        clauses: result.clauses || []
      });

      // Send file for download
      res.download(pdfPath, `${result.document.title}-analysis.pdf`, (err) => {
        if (err) {
          console.error('Download error:', err);
          res.status(500).json({ message: 'Failed to download PDF' });
        }
        // Clean up file after download
        setTimeout(() => {
          try {
            require('fs').unlinkSync(pdfPath);
          } catch (error) {
            console.error('Error cleaning up PDF:', error);
          }
        }, 5000);
      });
    } catch (error) {
      console.error('PDF download error:', error);
      res.status(500).json({ message: 'Failed to generate PDF' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
