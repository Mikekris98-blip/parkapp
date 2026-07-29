export interface BadgeDef {
  key: string;
  emoji: string;
  name: string;
  criteria: string;
}

export const CAMPER_BADGES: BadgeDef[] = [
  { key: 'paw', emoji: '🐾', name: 'First Paw Print', criteria: 'Log your very first park' },
  { key: 'cub', emoji: '🐻', name: 'Curious Cub', criteria: 'Visit 5 different parks' },
  { key: 'wolf', emoji: '🐺', name: 'Trail Wolf', criteria: 'Visit 10 different parks' },
  { key: 'owl', emoji: '🦉', name: 'Old-Growth Owl', criteria: 'Visit 20 different parks' },
  { key: 'fox', emoji: '🦊', name: 'Quick Fox', criteria: '2 parks in one month' },
  { key: 'beaver', emoji: '🦫', name: 'Busy Beaver', criteria: '2 parks in one year' },
  { key: 'flock', emoji: '🦢', name: 'Migration Flock', criteria: '5 parks in one year' },
  { key: 'deer', emoji: '🦌', name: 'Four Seasons Deer', criteria: 'A visit in every season' },
  { key: 'otter', emoji: '🦦', name: 'Social Otter', criteria: 'Share 3 entries publicly' },
  { key: 'chipmunk', emoji: '🐿️', name: 'Shutterbug Chipmunk', criteria: 'Add photos to 5 entries' },
];
