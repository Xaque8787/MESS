export const APP_CATEGORIES = [
  'MEDIA SERVERS',
  'STARR APPS',
  'DOWNLOAD CLIENTS',
  'MANAGEMENT',
] as const;

export type AppCategory = typeof APP_CATEGORIES[number];
