import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  translations: Record<string, any>;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Default UI translations for the 3 supported languages: English, Hindi, and Kannada only
const defaultTranslations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.upload': 'Upload',
    'nav.dashboard': 'Dashboard',
    'nav.chatbot': 'Chatbot',
    'nav.glossary': 'Glossary',
    'nav.profile': 'Profile',
    'nav.logout': 'Log out',
    
    // Landing Page
    'landing.title': 'LexiAI',
    'landing.subtitle': 'Legal Made Simple',
    'landing.description': 'Transform complex legal documents into crystal-clear, actionable insights with cutting-edge AI. Understand your rights, risks, and obligations—no expensive lawyer required!',
    'landing.cta': 'Get Started FREE - UNLIMITED Documents!',
    'landing.subtitle2': 'No credit card needed • Completely FREE • English, Hindi & Kannada support',
    
    // Upload Page
    'upload.title': 'Upload Your Legal Document',
    'upload.description': 'Upload your legal documents for lightning-fast AI-powered analysis! Get crystal-clear insights on obligations, risks, and deadlines in seconds.',
    'upload.button': 'Upload & Analyze Document',
    'upload.title.label': 'Document Title',
    'upload.file.label': 'Select Document',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.finish': 'Finish',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.settings': 'Settings'
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.upload': 'अपलोड',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.chatbot': 'चैटबॉट',
    'nav.glossary': 'शब्दकोश',
    'nav.profile': 'प्रोफाइल',
    'nav.logout': 'लॉग आउट',
    
    // Landing Page
    'landing.title': 'लेक्सीएआई',
    'landing.subtitle': 'कानून को सरल बनाया',
    'landing.description': 'अत्याधुनिक एआई के साथ जटिल कानूनी दस्तावेजों को स्पष्ट, कार्यात्मक अंतर्दृष्टि में बदलें। अपने अधिकारों, जोखिमों और दायित्वों को समझें—महंगे वकील की जरूरत नहीं!',
    'landing.cta': 'निःशुल्क शुरू करें - असीमित दस्तावेज!',
    'landing.subtitle2': 'क्रेडिट कार्ड की आवश्यकता नहीं • पूर्णतः निःशुल्क • अंग्रेजी, हिंदी और कन्नड़ समर्थन',
    
    // Upload Page
    'upload.title': 'अपना कानूनी दस्तावेज अपलोड करें',
    'upload.description': 'बिजली की तरह तेज एआई-संचालित विश्लेषण के लिए अपने कानूनी दस्तावेज अपलोड करें! सेकंडों में दायित्वों, जोखिमों और समय सीमा पर स्पष्ट अंतर्दृष्टि प्राप्त करें।',
    'upload.button': 'अपलोड और विश्लेषण करें',
    'upload.title.label': 'दस्तावेज शीर्षक',
    'upload.file.label': 'दस्तावेज चुनें',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.continue': 'जारी रखें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.finish': 'समाप्त',
    'common.save': 'सेव करें',
    'common.delete': 'मिटाएं',
    'common.edit': 'संपादित करें',
    'common.view': 'देखें',
    'common.download': 'डाउनलोड',
    'common.upload': 'अपलोड',
    'common.search': 'खोजें',
    'common.filter': 'फिल्टर',
    'common.sort': 'क्रमबद्ध करें',
    'common.settings': 'सेटिंग्स'
  },
  kn: {
    // Navigation
    'nav.home': 'ಮುಖ್ಯಪುಟ',
    'nav.upload': 'ಅಪ್‌ಲೋಡ್',
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.chatbot': 'ಚಾಟ್‌ಬಾಟ್',
    'nav.glossary': 'ಪದಕೋಶ',
    'nav.profile': 'ಪ್ರೊಫೈಲ್',
    'nav.logout': 'ಲಾಗ್ ಔಟ್',
    
    // Landing Page
    'landing.title': 'ಲೆಕ್ಸಿಎಐ',
    'landing.subtitle': 'ಕಾನೂನು ಸರಳೀಕೃತ',
    'landing.description': 'ಅತ್ಯಾಧುನಿಕ AI ಯೊಂದಿಗೆ ಸಂಕೀರ್ಣ ಕಾನೂನು ದಾಖಲೆಗಳನ್ನು ಸ್ಪಷ್ಟ, ಕ್ರಿಯಾಶೀಲ ಒಳನೋಟಗಳಾಗಿ ಪರಿವರ್ತಿಸಿ. ನಿಮ್ಮ ಹಕ್ಕುಗಳು, ಅಪಾಯಗಳು ಮತ್ತು ಜವಾಬ್ದಾರಿಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ—ದುಬಾರಿ ವಕೀಲರ ಅಗತ್ಯವಿಲ್ಲ!',
    'landing.cta': 'ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ - ಅಮಿತ ದಾಖಲೆಗಳು!',
    'landing.subtitle2': 'ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಅಗತ್ಯವಿಲ್ಲ • ಸಂಪೂರ್ಣವಾಗಿ ಉಚಿತ • ಇಂಗ್ಲೀಷ್, ಹಿಂದಿ ಮತ್ತು ಕನ್ನಡ ಬೆಂಬಲ',
    
    // Upload Page
    'upload.title': 'ನಿಮ್ಮ ಕಾನೂನು ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    'upload.description': 'ಮಿಂಚಿನ ವೇಗದ AI-ಚಾಲಿತ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ನಿಮ್ಮ ಕಾನೂನು ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ! ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಜವಾಬ್ದಾರಿಗಳು, ಅಪಾಯಗಳು ಮತ್ತು ಗಡುವುಗಳ ಬಗ್ಗೆ ಸ್ಪಷ್ಟ ಒಳನೋಟಗಳನ್ನು ಪಡೆಯಿರಿ.',
    'upload.button': 'ಅಪ್‌ಲೋಡ್ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ',
    'upload.title.label': 'ದಾಖಲೆ ಶೀರ್ಷಿಕೆ',
    'upload.file.label': 'ದಾಖಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    
    // Common
    'common.loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    'common.error': 'ದೋಷ',
    'common.success': 'ಯಶಸ್ಸು',
    'common.cancel': 'ರದ್ದುಮಾಡಿ',
    'common.continue': 'ಮುಂದುವರಿಸಿ',
    'common.back': 'ಹಿಂದೆ',
    'common.next': 'ಮುಂದೆ',
    'common.finish': 'ಮುಗಿಸಿ',
    'common.save': 'ಉಳಿಸಿ',
    'common.delete': 'ಅಳಿಸಿ',
    'common.edit': 'ಸಂಪಾದಿಸಿ',
    'common.view': 'ವೀಕ್ಷಿಸಿ',
    'common.download': 'ಡೌನ್‌ಲೋಡ್',
    'common.upload': 'ಅಪ್‌ಲೋಡ್',
    'common.search': 'ಹುಡುಕಿ',
    'common.filter': 'ಫಿಲ್ಟರ್',
    'common.sort': 'ಆಯ್ಕೆಮಾಡಿ',
    'common.settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು'
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, any>>(defaultTranslations.en);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && defaultTranslations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
      setTranslations(defaultTranslations[savedLanguage]);
    }
  }, []);

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    // Use default translations if available, otherwise use English
    setTranslations(defaultTranslations[language] || defaultTranslations.en);
    localStorage.setItem('preferredLanguage', language);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      translations,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};