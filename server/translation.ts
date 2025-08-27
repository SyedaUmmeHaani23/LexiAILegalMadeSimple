import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Supported languages - English, Kannada, and Hindi only
export const SUPPORTED_LANGUAGES: Record<string, string> = {
  'en': 'English',
  'hi': 'Hindi (हिंदी)',
  'kn': 'Kannada (ಕನ್ನಡ)'
};

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (targetLanguage === 'en' || !text) {
    return text;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using newer, faster model
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text to ${SUPPORTED_LANGUAGES[targetLanguage]} while maintaining the original meaning, tone, and any legal terminology. Keep formatting intact.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

export async function translateAnalysisResults(analysis: any, targetLanguage: string) {
  if (targetLanguage === 'en') {
    return analysis;
  }

  try {
    const translatedAnalysis = { ...analysis };
    
    // Translate summary
    if (analysis.summary) {
      translatedAnalysis.summary = await translateText(analysis.summary, targetLanguage);
    }

    // Translate obligations
    if (analysis.obligations && Array.isArray(analysis.obligations)) {
      translatedAnalysis.obligations = await Promise.all(
        analysis.obligations.map(async (obligation: any) => ({
          ...obligation,
          description: await translateText(obligation.description, targetLanguage),
          action: await translateText(obligation.action, targetLanguage)
        }))
      );
    }

    // Translate risks
    if (analysis.risks && Array.isArray(analysis.risks)) {
      translatedAnalysis.risks = await Promise.all(
        analysis.risks.map(async (risk: any) => ({
          ...risk,
          description: await translateText(risk.description, targetLanguage),
          impact: await translateText(risk.impact, targetLanguage),
          mitigation: await translateText(risk.mitigation, targetLanguage)
        }))
      );
    }

    // Translate deadlines
    if (analysis.deadlines && Array.isArray(analysis.deadlines)) {
      translatedAnalysis.deadlines = await Promise.all(
        analysis.deadlines.map(async (deadline: any) => ({
          ...deadline,
          description: await translateText(deadline.description, targetLanguage),
          consequence: await translateText(deadline.consequence, targetLanguage)
        }))
      );
    }

    return translatedAnalysis;
  } catch (error) {
    console.error('Error translating analysis results:', error);
    return analysis; // Return original if translation fails
  }
}

export async function translateClauses(clauses: any[], targetLanguage: string) {
  if (targetLanguage === 'en') {
    return clauses;
  }

  try {
    return await Promise.all(
      clauses.map(async (clause: any) => ({
        ...clause,
        simplifiedText: await translateText(clause.simplifiedText, targetLanguage),
        explanation: await translateText(clause.explanation, targetLanguage),
        actionableAdvice: clause.actionableAdvice ? 
          await translateText(clause.actionableAdvice, targetLanguage) : 
          null
      }))
    );
  } catch (error) {
    console.error('Error translating clauses:', error);
    return clauses; // Return original if translation fails
  }
}