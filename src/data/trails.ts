import type { TreasureTrail } from '../types/models';

// Admin-curated content is out of scope for this build (see AGENTS.md build
// order) — these are the prototype's placeholder trails, locked to Premium.
export const seedTrails: TreasureTrail[] = [
  {
    id: 'ridgeline-riddle',
    icon: '🗺️',
    name: 'Ridgeline Riddle',
    description: 'A 4-mile clue hunt along the eastern ridge — five checkpoints, one final marker.',
    checkpointCount: 5,
  },
  {
    id: 'hollow-creek-hunt',
    icon: '🧭',
    name: 'Hollow Creek Hunt',
    description: 'Follow the creek bed clues to an overlook few hikers ever find.',
    checkpointCount: 4,
  },
  {
    id: 'night-owl-trail',
    icon: '🔦',
    name: 'Night Owl Trail',
    description: 'A dusk scavenger hunt built around nocturnal wildlife sightings.',
    checkpointCount: 6,
  },
];
