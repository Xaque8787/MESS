export const APP_CATEGORIES = [
  'MEDIA SERVERS',
  'STARR APPS',
  'DOWNLOAD CLIENTS',
  'M3U UTILITY',
  'MANAGEMENT',
] as const;

export type AppCategory = typeof APP_CATEGORIES[number];