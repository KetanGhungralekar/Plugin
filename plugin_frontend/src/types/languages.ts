export interface Language {
  code: string;
  name: string;
  localName: string;
}

export const indianLanguages: Language[] = [
  { code: 'hi-IN', name: 'Hindi', localName: 'हिन्दी' },
  { code: 'mr-IN', name: 'Marathi', localName: 'मराठी' },
  { code: 'ta-IN', name: 'Tamil', localName: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', localName: 'తెలుగు' },
  { code: 'kn-IN', name: 'Kannada', localName: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', localName: 'മലയാളം' },
  { code: 'gu-IN', name: 'Gujarati', localName: 'ગુજરાતી' },
  { code: 'bn-IN', name: 'Bengali', localName: 'বাংলা' },
  { code: 'en-IN', name: 'English (India)', localName: 'English' },
];