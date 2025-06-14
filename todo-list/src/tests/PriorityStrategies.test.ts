import { TaskPriority } from '../types';
import { HighPriorityStrategy, MediumPriorityStrategy, LowPriorityStrategy, PriorityStrategyFactory } from '../patterns/strategy/PriorityStrategies';

describe('Priority Strategies', () => {
  describe('HighPriorityStrategy', () => {
    const strategy = new HighPriorityStrategy();

    test('should return priority level 3', () => {
      expect(strategy.getPriorityLevel()).toBe(3);
    });

    test('should return correct color', () => {
      expect(strategy.getColor()).toBe('#ff4d4d');
    });
  });

  describe('MediumPriorityStrategy', () => {
    const strategy = new MediumPriorityStrategy();

    test('should return priority level 2', () => {
      expect(strategy.getPriorityLevel()).toBe(2);
    });

    test('should return correct color', () => {
      expect(strategy.getColor()).toBe('#ffa64d');
    });
  });

  describe('LowPriorityStrategy', () => {
    const strategy = new LowPriorityStrategy();

    test('should return priority level 1', () => {
      expect(strategy.getPriorityLevel()).toBe(1);
    });

    test('should return correct color', () => {
      expect(strategy.getColor()).toBe('#4dff4d');
    });
  });

  describe('PriorityStrategyFactory', () => {
    test('should return HighPriorityStrategy for HIGH priority', () => {
      const strategy = PriorityStrategyFactory.getStrategy(TaskPriority.HIGH);
      expect(strategy).toBeInstanceOf(HighPriorityStrategy);
    });

    test('should return MediumPriorityStrategy for MEDIUM priority', () => {
      const strategy = PriorityStrategyFactory.getStrategy(TaskPriority.MEDIUM);
      expect(strategy).toBeInstanceOf(MediumPriorityStrategy);
    });

    test('should return LowPriorityStrategy for LOW priority', () => {
      const strategy = PriorityStrategyFactory.getStrategy(TaskPriority.LOW);
      expect(strategy).toBeInstanceOf(LowPriorityStrategy);
    });

    test('should return MediumPriorityStrategy for unknown priority', () => {
      const strategy = PriorityStrategyFactory.getStrategy('UNKNOWN' as TaskPriority);
      expect(strategy).toBeInstanceOf(MediumPriorityStrategy);
    });
  });
}); 