import * as fs from 'fs';
import * as path from 'path';
// Import pdf-parse dynamically to avoid initialization issues
import mammoth from 'mammoth';
import { storage } from '../storage';
import { analyzeLegalDocument, analyzeDocumentClauses } from '../openai';
import type { InsertDocument, InsertDocumentAnalysis, InsertClause } from '@shared/schema';

export interface DocumentProcessingResult {
  documentId: string;
  success: boolean;
  error?: string;
}

export class DocumentService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async processUploadedDocument(
    userId: string,
    file: Express.Multer.File,
    title: string
  ): Promise<DocumentProcessingResult> {
    try {
      // Create document record
      const documentData: InsertDocument = {
        userId,
        title,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype,
        filePath: file.path,
        status: 'processing'
      };

      const document = await storage.createDocument(documentData);

      // Extract text from document (simplified - in production you'd use proper PDF/Word parsers)
      const documentText = await this.extractTextFromFile(file.path, file.mimetype);

      if (!documentText || documentText.trim().length === 0) {
        await storage.updateDocumentStatus(document.id, 'error');
        return {
          documentId: document.id,
          success: false,
          error: 'Could not extract text from document'
        };
      }

      // Analyze document with AI
      const analysis = await analyzeLegalDocument(documentText, title);
      const clauseAnalyses = await analyzeDocumentClauses(documentText);

      // Save analysis results
      const analysisData: InsertDocumentAnalysis = {
        documentId: document.id,
        summary: analysis.summary,
        riskLevel: analysis.riskLevel,
        obligations: analysis.obligations,
        risks: analysis.risks,
        deadlines: analysis.deadlines
      };

      await storage.createDocumentAnalysis(analysisData);

      // Save individual clauses
      const clauseData: InsertClause[] = clauseAnalyses.map((clause, index) => ({
        documentId: document.id,
        originalText: clause.originalText,
        simplifiedText: clause.simplifiedText,
        clauseType: clause.clauseType,
        riskLevel: clause.riskLevel,
        explanation: clause.explanation,
        actionableAdvice: clause.actionableAdvice,
        position: index + 1
      }));

      // Save clauses individually
      for (const clause of clauseData) {
        await storage.createClause(clause);
      }

      // Update document status
      await storage.updateDocumentStatus(document.id, 'analyzed');

      return {
        documentId: document.id,
        success: true
      };

    } catch (error) {
      console.error('Error processing document:', error);
      return {
        documentId: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async extractTextFromFile(filePath: string, mimeType: string): Promise<string> {
    try {
      console.log(`Extracting text from file: ${filePath}, type: ${mimeType}`);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      
      if (mimeType === 'application/pdf') {
        console.log('Processing PDF file - using pdfjs-dist for reliable extraction');
        
        try {
          // Read PDF buffer
          const pdfBuffer = fs.readFileSync(filePath);
          console.log(`PDF buffer size: ${pdfBuffer.length} bytes`);
          
          if (pdfBuffer.length === 0) {
            throw new Error('PDF file is empty or corrupted');
          }
          
          // Use pdfjs-dist which is more reliable
          const pdfjsLib = await import('pdfjs-dist');
          
          // Load the PDF document
          const loadingTask = pdfjsLib.getDocument({
            data: pdfBuffer,
            verbosity: 0 // Suppress console output
          });
          
          const pdfDoc = await loadingTask.promise;
          console.log(`PDF loaded successfully. Pages: ${pdfDoc.numPages}`);
          
          let fullText = '';
          
          // Extract text from each page
          for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            try {
              const page = await pdfDoc.getPage(pageNum);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
              fullText += pageText + '\n';
            } catch (pageError) {
              console.warn(`Could not extract text from page ${pageNum}:`, pageError);
              // Continue with other pages
            }
          }
          
          const extractedText = fullText.trim();
          
          if (extractedText && extractedText.length > 20) {
            console.log(`Successfully extracted ${extractedText.length} characters from PDF`);
            return extractedText;
          } else if (extractedText.length > 0) {
            console.log('PDF has minimal text content, but proceeding');
            return extractedText;
          } else {
            console.log('PDF appears to be empty or image-only');
            throw new Error('This PDF appears to contain only images or is empty. Please try uploading a text-based PDF or convert it to Word/TXT format.');
          }
        } catch (error: any) {
          console.error('PDF processing error:', error);
          
          // Provide more helpful error messages based on error type
          if (error?.message?.includes('password') || error?.message?.includes('encrypted')) {
            throw new Error('🔒 This PDF is password-protected. Please remove the password and try again.');
          } else if (error?.message?.includes('Invalid PDF') || error?.message?.includes('corrupted')) {
            throw new Error('📄 This file appears to be corrupted or not a valid PDF. Please try re-saving or converting to Word/TXT format.');
          } else if (error?.message?.includes('images') || error?.message?.includes('empty')) {
            throw new Error('🖼️ This PDF contains scanned images or has no text content. Please try uploading a text-based PDF or convert it to Word/TXT format.');
          } else {
            // Generic fallback with helpful message
            throw new Error('⚠️ Failed to process this PDF. Please try uploading a Word document (.docx) or text file (.txt) instead.');
          }
        }
      } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('Processing DOCX file - parsing actual content');
        const docxBuffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer: docxBuffer });
        const extractedText = result.value.trim();
        
        if (extractedText && extractedText.length > 0) {
          console.log(`Successfully extracted ${extractedText.length} characters from DOCX`);
          return extractedText;
        } else {
          console.log('DOCX appears to be empty, cannot extract text');
          throw new Error('No text content found in DOCX file');
        }
      } else if (mimeType === 'application/msword') {
        console.log('Processing DOC file - attempting text extraction');
        // For .doc files, try reading as text first, then fallback
        try {
          const textContent = fs.readFileSync(filePath, 'utf-8');
          if (textContent.trim().length > 0) {
            return textContent;
          } else {
            throw new Error('No text content found in DOC file');
          }
        } catch (error) {
          console.log('Failed to read DOC file as text');
          throw new Error('Could not extract text from DOC file');
        }
      } else if (mimeType.includes('text/')) {
        console.log('Processing text file - reading actual content');
        const textContent = fs.readFileSync(filePath, 'utf-8').trim();
        
        if (textContent && textContent.length > 0) {
          console.log(`Successfully extracted ${textContent.length} characters from text file`);
          return textContent;
        } else {
          console.log('Text file appears to be empty, cannot extract text');
          throw new Error('No text content found in text file');
        }
      } else {
        console.log('Unsupported file type');
        throw new Error('Unsupported file type for text extraction');
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      throw error;
    }
  }

  private getSampleRentalAgreementText(): string {
    return `
RESIDENTIAL LEASE AGREEMENT

This Residential Lease Agreement ("Agreement") is entered into between the Landlord and the Tenant for the rental of the premises located at Downtown Apartment.

1. RENT PAYMENT
The Tenant agrees to pay rent in the amount of $1,200 per month, due on or before the 5th day of each month during the term of this lease agreement. Late payment will result in a $50 late fee after a 5-day grace period.

2. LEASE TERM
This lease agreement shall commence on January 1, 2024, and shall continue for a period of twelve (12) months, ending on December 31, 2024. This lease agreement shall automatically renew for additional one-year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to expiration.

3. SECURITY DEPOSIT
The Tenant shall pay a security deposit of $1,200 upon signing this agreement. The security deposit will be returned within thirty (30) days after the termination of this lease, less any deductions for damages or unpaid rent.

4. EARLY TERMINATION
In the event of early termination by the Tenant, the Tenant shall forfeit the security deposit and pay an additional penalty equal to two (2) months' rent. The Landlord reserves the right to pursue additional damages.

5. MAINTENANCE AND REPAIRS
The Tenant is responsible for maintaining the premises in good condition and promptly reporting any needed repairs to the Landlord. The Tenant shall be liable for damages caused by negligence or misuse.

6. PETS
No pets are allowed on the premises without prior written consent from the Landlord. Unauthorized pets will result in immediate lease termination and forfeiture of the security deposit.

7. UTILITIES
The Tenant is responsible for all utilities including electricity, gas, water, sewer, trash, and internet services. Failure to maintain utility services may result in lease termination.

8. INSURANCE
The Tenant is required to maintain renter's insurance with minimum liability coverage of $100,000. Proof of insurance must be provided to the Landlord within seven (7) days of lease signing.

9. SUBLETTING
Subletting or assignment of this lease is prohibited without written consent from the Landlord. Unauthorized subletting will result in immediate lease termination.

10. GOVERNING LAW
This agreement shall be governed by the laws of the state jurisdiction. Any disputes shall be resolved through binding arbitration.

By signing below, both parties agree to the terms and conditions set forth in this lease agreement.
`;
  }

  async getDocumentWithAnalysis(documentId: string, userId: string) {
    const document = await storage.getDocument(documentId);
    if (!document || document.userId !== userId) {
      return null;
    }

    const analysis = await storage.getDocumentAnalysis(documentId);
    const clauses = await storage.getDocumentClauses(documentId);

    return {
      document,
      analysis,
      clauses
    };
  }
}

export const documentService = new DocumentService();
