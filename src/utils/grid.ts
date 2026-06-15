import type { Layout } from '../store/dashboardStore';

/**
 * Checks if two grid items collide.
 */
export const detectCollision = (
  layout: Layout[],
  pos: { x: number; y: number; w: number; h: number }
): boolean => {
  for (let i = 0; i < layout.length; i++) {
    const item = layout[i];
    if (
      item.x < pos.x + pos.w &&
      item.x + item.w > pos.x &&
      item.y < pos.y + pos.h &&
      item.y + item.h > pos.y
    ) {
      return true;
    }
  }
  return false;
};

/**
 * Validates if a position is within grid boundaries and doesn't collide.
 */
export const isPositionValid = (
  layout: Layout[],
  pos: { x: number; y: number; w: number; h: number },
  cols: number
): boolean => {
  // Check boundaries
  if (pos.x < 0 || pos.y < 0 || pos.x + pos.w > cols) {
    return false;
  }
  // Check collision
  return !detectCollision(layout, pos);
};

/**
 * Finds the next available position for a widget of size w x h.
 * Scans row by row, from left to right.
 */
export const nextAvailablePosition = (
  layout: Layout[],
  cols: number,
  w: number,
  h: number
): { x: number; y: number } => {
  let y = 0;
  let x = 0;

  while (true) {
    // Attempt to place at (x, y)
    const pos = { x, y, w, h };
    
    // Check if it fits in current row bounds
    if (x + w <= cols) {
      if (!detectCollision(layout, pos)) {
        return { x, y };
      }
      x++;
    } else {
      // Move to next row
      x = 0;
      y++;
    }
  }
};
