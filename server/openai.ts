import OpenAI from "openai";

// Using GPT-4 model for best performance
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface LegalAnalysisResult {
  summary: string;
  riskLevel: "low" | "medium" | "high";
  obligations: Array<{
    text: string;
    simplified: string;
    importance: "low" | "medium" | "high";
  }>;
  risks: Array<{
    text: string;
    simplified: string;
    riskLevel: "low" | "medium" | "high";
    potential_impact: string;
  }>;
  deadlines: Array<{
    text: string;
    simplified: string;
    deadline_type: string;
    urgency: "low" | "medium" | "high";
  }>;
}

export interface ClauseAnalysis {
  originalText: string;
  simplifiedText: string;
  clauseType: "obligation" | "risk" | "deadline" | "neutral";
  riskLevel?: "low" | "medium" | "high";
  explanation: string;
  actionableAdvice: string;
}

export async function analyzeLegalDocument(documentText: string, title: string): Promise<LegalAnalysisResult> {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured. Please add your API key to continue using AI features.');
    }

    const prompt = `You are a friendly legal expert AI assistant specializing in simplifying complex legal documents for everyday users. Analyze the following legal document and provide a comprehensive breakdown with helpful emojis and clear risk highlighting.

Document Title: ${title}
Document Content: ${documentText}

Please analyze this legal document and respond with JSON in this exact format:
{
  "summary": "A clear, plain-English summary of the document with appropriate emojis (2-3 sentences)",
  "riskLevel": "low|medium|high",
  "obligations": [
    {
      "text": "original clause text",
      "simplified": "📝 plain English explanation with appropriate emojis", 
      "importance": "low|medium|high"
    }
  ],
  "risks": [
    {
      "text": "original clause text",
      "simplified": "⚠️ plain English explanation with warning emojis",
      "riskLevel": "low|medium|high",
      "potential_impact": "💸 what could happen to the user (use impact emojis)"
    }
  ],
  "deadlines": [
    {
      "text": "original clause text", 
      "simplified": "⏰ plain English explanation with time-related emojis",
      "deadline_type": "payment|renewal|termination|notice|other",
      "urgency": "low|medium|high"
    }
  ]
}

EMOJI GUIDELINES:
- Use 📝 for general obligations
- Use ⚠️ 🚨 ❌ for high-risk items
- Use 💸 💰 for financial impacts
- Use ⏰ 📅 ⏳ for time-sensitive items
- Use 🏠 for housing/rental agreements
- Use 💼 for employment contracts
- Use 🔒 for security/confidentiality
- Use ⚖️ for legal consequences
- Use 🆘 for critical warnings
- Use ✅ for positive/safe items
- Use 📋 for compliance requirements

Focus on:
- Key obligations the user must fulfill (with 📝 emojis)
- Potential risks, penalties, or unfavorable terms (with ⚠️ 🚨 emojis)
- Important deadlines and time-sensitive requirements (with ⏰ 📅 emojis)
- Financial implications (with 💸 💰 emojis)
- Use simple, clear language that a non-lawyer can understand
- Highlight anything that could result in financial loss or legal issues with appropriate warning emojis
- Make the analysis engaging and easy to scan with emojis`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Faster and cheaper model for lightning speed
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result;
  } catch (error: any) {
    // Handle specific OpenAI errors
    if (error.status === 429) {
      throw new Error('OpenAI API quota exceeded. Please check your billing and usage limits, or try again later.');
    } else if (error.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your API key configuration.');
    } else if (error.status === 400) {
      throw new Error('Invalid request to OpenAI API. The document might be too large or contain unsupported content.');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new Error('Unable to connect to OpenAI API. Please check your internet connection.');
    }
    
    throw new Error(`Failed to analyze legal document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function analyzeDocumentClauses(documentText: string): Promise<ClauseAnalysis[]> {
  try {
    const prompt = `You are a friendly legal expert AI assistant. Break down this legal document into individual clauses and analyze each one for everyday users with helpful emojis and clear risk highlighting.

Document: ${documentText}

For each significant clause in the document, provide analysis in this JSON format:
{
  "clauses": [
    {
      "originalText": "exact text of the clause",
      "simplifiedText": "📝 simplified version in plain English with appropriate emojis",
      "clauseType": "obligation|risk|deadline|neutral",
      "riskLevel": "low|medium|high (only for risk type clauses)",
      "explanation": "detailed explanation of what this means for the user",
      "actionableAdvice": "specific advice on what the user should do"
    }
  ]
}

Guidelines:
- Extract 5-15 most important clauses
- Focus on clauses that impact the user directly
- Use clear, simple language
- Provide actionable advice for each clause
- Classify each clause accurately by type`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Faster and cheaper model for lightning speed
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result.clauses || [];
  } catch (error) {
    throw new Error(`Failed to analyze document clauses: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function answerLegalQuestion(question: string, documentContext: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<string> {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return "I'm sorry, but the AI features are currently unavailable because the OpenAI API key is not configured. Please contact support to enable AI-powered document analysis and chat features.";
    }

    const systemPrompt = `You are LexiAI, a helpful legal assistant created by Syeda Umme Haani. You specialize in explaining legal documents in simple, clear language for everyday users.

Context: You have access to a legal document that the user has uploaded. Use this document to answer their questions accurately and helpfully.

Document Context: ${documentContext}

Guidelines:
- Always refer to the specific document when answering
- Use simple, clear language that anyone can understand
- If the document doesn't contain relevant information, say so clearly
- Provide actionable advice when appropriate
- Be helpful and reassuring while being accurate
- If something is unclear or requires professional legal advice, recommend consulting a lawyer`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: question }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Faster and cheaper model for lightning speed
      messages: messages as any,
      temperature: 0.4,
      max_tokens: 500,
    });

    return response.choices[0].message.content!;
  } catch (error: any) {
    // Handle specific OpenAI errors gracefully
    if (error.status === 429) {
      return "I'm currently experiencing high demand and my AI processing quota has been exceeded. Please try again in a few minutes, or contact support for assistance.";
    } else if (error.status === 401) {
      return "There's an issue with the AI service configuration. Please contact support to resolve this.";
    } else if (error.status === 400) {
      return "I'm sorry, but I couldn't process your question due to a formatting issue. Could you try rephrasing your question?";
    }
    
    return "I'm experiencing technical difficulties right now. Please try again later, or contact support if the problem persists.";
  }
}
