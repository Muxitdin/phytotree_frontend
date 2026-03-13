export type Locale = 'ru' | 'en' | 'uz';

export interface LocaleInfo {
  code: Locale;
  name: string;
  flag: string;
}

export const LOCALES: LocaleInfo[] = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'uz', name: 'O\'zbek', flag: '🇺🇿' },
];

export const DEFAULT_LOCALE: Locale = 'ru';
