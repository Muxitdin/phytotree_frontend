import { ru, Dictionary } from './ru';
import { en } from './en';
import { uz } from './uz';
import { Locale } from '../types';

export const dictionaries: Record<Locale, Dictionary> = {
  ru,
  en,
  uz,
};

export type { Dictionary };
