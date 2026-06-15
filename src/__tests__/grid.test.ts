import { describe, it, expect } from 'vitest';
import { detectCollision, isPositionValid, nextAvailablePosition } from '../utils/grid';
import type { Layout } from '../store/dashboardStore';

describe('Grid Utilities', () => {
  describe('detectCollision', () => {
    it('should detect collision when widgets overlap', () => {
      const layout: Layout[] = [
        { i: '1', x: 0, y: 0, w: 4, h: 4 },
      ];
      
      const newPos = { x: 2, y: 2, w: 4, h: 4 };
      expect(detectCollision(layout, newPos)).toBe(true);
    });

    it('should not detect collision when widgets are adjacent', () => {
      const layout: Layout[] = [
        { i: '1', x: 0, y: 0, w: 4, h: 4 },
      ];
      
      const newPos = { x: 4, y: 0, w: 4, h: 4 };
      expect(detectCollision(layout, newPos)).toBe(false);
    });
  });

  describe('isPositionValid', () => {
    it('should return false if position is out of bounds', () => {
      const layout: Layout[] = [];
      const cols = 12;
      
      // out of x bounds
      expect(isPositionValid(layout, { x: 10, y: 0, w: 4, h: 4 }, cols)).toBe(false);
      // negative bounds
      expect(isPositionValid(layout, { x: -1, y: 0, w: 4, h: 4 }, cols)).toBe(false);
    });

    it('should return true if position is valid and no collision', () => {
      const layout: Layout[] = [
        { i: '1', x: 0, y: 0, w: 4, h: 4 },
      ];
      const cols = 12;
      
      expect(isPositionValid(layout, { x: 4, y: 0, w: 4, h: 4 }, cols)).toBe(true);
    });
  });

  describe('nextAvailablePosition', () => {
    it('should find the next available position in the first row', () => {
      const layout: Layout[] = [
        { i: '1', x: 0, y: 0, w: 4, h: 4 },
      ];
      const cols = 12;
      
      const pos = nextAvailablePosition(layout, cols, 4, 4);
      expect(pos).toEqual({ x: 4, y: 0 });
    });

    it('should move to the next row if the first row is full', () => {
      const layout: Layout[] = [
        { i: '1', x: 0, y: 0, w: 4, h: 4 },
        { i: '2', x: 4, y: 0, w: 4, h: 4 },
        { i: '3', x: 8, y: 0, w: 4, h: 4 },
      ];
      const cols = 12;
      
      const pos = nextAvailablePosition(layout, cols, 4, 4);
      expect(pos).toEqual({ x: 0, y: 1 });
    });
  });
});
