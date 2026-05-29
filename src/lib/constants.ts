// ============================================================
// Input Constraints
// Prevents localStorage quota exhaustion from excessively long values.
// ============================================================

export const INPUT_MAX = {
  SHORT: 200,   // names, labels, metric names
  MEDIUM: 500,  // single-line descriptions, price ranges
  LONG: 2000,   // multi-line text areas (descriptions, notes, strategies)
} as const;
