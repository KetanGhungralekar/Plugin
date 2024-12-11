import React from 'react';
import { Language } from '../types/languages';
import { Globe2 } from 'lucide-react';

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ 
  languages, 
  selectedLanguage, 
  onLanguageChange 
}: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe2 className="w-5 h-5 text-gray-600" />
      <select
        value={selectedLanguage.code}
        onChange={(e) => {
          const language = languages.find(lang => lang.code === e.target.value);
          if (language) onLanguageChange(language);
        }}
        className="block w-full rounded-md border-gray-300 shadow-sm 
                   focus:border-blue-500 focus:ring-blue-500 bg-white
                   py-2 pl-3 pr-10 text-sm"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name} ({language.localName})
          </option>
        ))}
      </select>
    </div>
  );
}