import { unionOfLiterals } from 'utils/unionOfLiterals';

export const languageCodes = ['en', 'pt'] as const;

export type LanguageCodes = (typeof languageCodes)[number];

export const languageSchema = unionOfLiterals(languageCodes);
