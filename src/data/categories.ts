export const APP_CATEGORIES = [
  'Media Server',
  'STARR APPS',
  'NETWORKING',
  'WEB APPS',
] as const;

export type AppCategory = typeof APP_CATEGORIES[number];
