import * as fs from 'fs';
import * as path from 'path';
import type { Document, DocumentAnalysis, Clause } from '@shared/schema';

export interface PDFGenerationOptions {
  document: Document;
  analysis: DocumentAnalysis;
  clauses: Clause[];
}

export class PDFService {
  private reportsDir = path.join(process.cwd(), 'reports');

  constructor() {
    // Ensure reports directory exists
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  async generateAnalysisReport(options: PDFGenerationOptions): Promise<string> {
    const { document, analysis, clauses } = options;
    
    try {
      const htmlContent = this.generateHTMLReport(document, analysis, clauses);
      const fileName = `analysis-${document.id}-${Date.now()}.pdf`;
      const filePath = path.join(this.reportsDir, fileName);

      // Use html-pdf-node for PDF generation
      const htmlPdf = await import('html-pdf-node');
      
      const pdfBuffer = await htmlPdf.generatePdf(
        { content: htmlContent },
        { 
          format: 'A4',
          printBackground: true,
          margin: { top: 20, right: 20, bottom: 20, left: 20 }
        }
      );

      fs.writeFileSync(filePath, pdfBuffer);
      return filePath;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  private generateHTMLReport(document: Document, analysis: DocumentAnalysis, clauses: Clause[]): string {
    const riskBadgeColor = {
      low: '#10B981',
      medium: '#F59E0B', 
      high: '#EF4444'
    };

    const obligationsHtml = Array.isArray(analysis.obligations) 
      ? analysis.obligations.map((obligation: any) => `
          <div class="clause-item">
            <div class="importance-badge importance-${obligation.importance}">${obligation.importance?.toUpperCase()}</div>
            <div class="original-text">${obligation.text}</div>
            <div class="simplified-text">${obligation.simplified}</div>
          </div>
        `).join('')
      : '<p>No obligations found.</p>';

    const risksHtml = Array.isArray(analysis.risks)
      ? analysis.risks.map((risk: any) => `
          <div class="clause-item">
            <div class="risk-badge risk-${risk.riskLevel}">${risk.riskLevel?.toUpperCase()}</div>
            <div class="original-text">${risk.text}</div>
            <div class="simplified-text">${risk.simplified}</div>
            <div class="impact-text"><strong>Potential Impact:</strong> ${risk.potential_impact}</div>
          </div>
        `).join('')
      : '<p>No risks identified.</p>';

    const deadlinesHtml = Array.isArray(analysis.deadlines)
      ? analysis.deadlines.map((deadline: any) => `
          <div class="clause-item">
            <div class="urgency-badge urgency-${deadline.urgency}">${deadline.urgency?.toUpperCase()}</div>
            <div class="deadline-type"><strong>Type:</strong> ${deadline.deadline_type}</div>
            <div class="original-text">${deadline.text}</div>
            <div class="simplified-text">${deadline.simplified}</div>
          </div>
        `).join('')
      : '<p>No deadlines found.</p>';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LexiAI Document Analysis Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .document-info {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
            border-left: 4px solid #667eea;
        }
        
        .document-info h2 {
            color: #667eea;
            margin-bottom: 15px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
        }
        
        .info-label {
            font-weight: bold;
            color: #666;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-value {
            font-size: 16px;
            color: #333;
            margin-top: 5px;
        }
        
        .summary-section {
            background: #fff;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .summary-section h2 {
            color: #333;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        
        .risk-level {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            color: white;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
            margin-left: 10px;
        }
        
        .risk-low { background-color: #10B981; }
        .risk-medium { background-color: #F59E0B; }
        .risk-high { background-color: #EF4444; }
        
        .section {
            margin-bottom: 35px;
        }
        
        .section h3 {
            color: #667eea;
            font-size: 20px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
        }
        
        .clause-item {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            position: relative;
        }
        
        .importance-badge, .risk-badge, .urgency-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            color: white;
        }
        
        .importance-low, .urgency-low { background-color: #10B981; }
        .importance-medium, .urgency-medium { background-color: #F59E0B; }
        .importance-high, .urgency-high { background-color: #EF4444; }
        
        .risk-low { background-color: #10B981; }
        .risk-medium { background-color: #F59E0B; }
        .risk-high { background-color: #EF4444; }
        
        .original-text {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 6px;
            font-style: italic;
            margin-bottom: 10px;
            border-left: 3px solid #dee2e6;
        }
        
        .simplified-text {
            color: #333;
            font-weight: 500;
            line-height: 1.6;
        }
        
        .impact-text {
            margin-top: 10px;
            padding: 10px;
            background: #fff3cd;
            border-radius: 6px;
            color: #856404;
        }
        
        .deadline-type {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }
        
        .footer {
            text-align: center;
            padding: 30px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
            margin-top: 40px;
        }
        
        .footer .logo {
            font-weight: bold;
            color: #667eea;
            font-size: 18px;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Document Analysis Report</h1>
        <p>Powered by LexiAI - Legal Made Simple</p>
    </div>
    
    <div class="container">
        <div class="document-info">
            <h2>📄 Document Information</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Document Title</div>
                    <div class="info-value">${document.title}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">File Name</div>
                    <div class="info-value">${document.fileName}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">File Size</div>
                    <div class="info-value">${(document.fileSize / 1024).toFixed(1)} KB</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Analysis Date</div>
                    <div class="info-value">${new Date().toLocaleDateString()}</div>
                </div>
            </div>
        </div>
        
        <div class="summary-section">
            <h2>
                📊 Executive Summary
                <span class="risk-level risk-${analysis.riskLevel}">${analysis.riskLevel} Risk</span>
            </h2>
            <p>${analysis.summary}</p>
        </div>
        
        <div class="section">
            <h3>⚡ Key Obligations</h3>
            ${obligationsHtml}
        </div>
        
        <div class="section">
            <h3>⚠️ Identified Risks</h3>
            ${risksHtml}
        </div>
        
        <div class="section">
            <h3>📅 Important Deadlines</h3>
            ${deadlinesHtml}
        </div>
    </div>
    
    <div class="footer">
        <div class="logo">LexiAI</div>
        <p>This analysis was generated using artificial intelligence and should not be considered as legal advice.</p>
        <p>For complex legal matters, please consult with a qualified attorney.</p>
    </div>
</body>
</html>`;
  }

  async cleanupOldReports(): Promise<void> {
    try {
      const files = fs.readdirSync(this.reportsDir);
      const oneHourAgo = Date.now() - (60 * 60 * 1000);

      for (const file of files) {
        const filePath = path.join(this.reportsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.birthtime.getTime() < oneHourAgo) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old reports:', error);
    }
  }
}

export const pdfService = new PDFService();