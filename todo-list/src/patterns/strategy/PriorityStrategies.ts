/**
 * @file Implements concrete priority strategies for tasks (Strategy Pattern).
 * Each strategy defines specific behavior and visual representation for a priority level.
 */

import { PriorityStrategy, TaskPriority } from '../../types';

/**
 * Strategy for tasks with High priority.
 * Defines a high priority level and an associated color.
 */
export class HighPriorityStrategy implements PriorityStrategy {
  /**
   * Returns the numeric level for High priority.
   * @returns {number} The priority level (3 for High).
   */
  getPriorityLevel(): number {
    return 3;
  }

  /**
   * Returns the color associated with High priority.
   * @returns {string} The HEX color string for High priority.
   */
  getColor(): string {
    return '#ff4d4d';
  }
}

/**
 * Strategy for tasks with Medium priority.
 * Defines a medium priority level and an associated color.
 */
export class MediumPriorityStrategy implements PriorityStrategy {
  /**
   * Returns the numeric level for Medium priority.
   * @returns {number} The priority level (2 for Medium).
   */
  getPriorityLevel(): number {
    return 2;
  }

  /**
   * Returns the color associated with Medium priority.
   * @returns {string} The HEX color string for Medium priority.
   */
  getColor(): string {
    return '#ffa64d';
  }
}

/**
 * Strategy for tasks with Low priority.
 * Defines a low priority level and an associated color.
 */
export class LowPriorityStrategy implements PriorityStrategy {
  /**
   * Returns the numeric level for Low priority.
   * @returns {number} The priority level (1 for Low).
   */
  getPriorityLevel(): number {
    return 1;
  }

  /**
   * Returns the color associated with Low priority.
   * @returns {string} The HEX color string for Low priority.
   */
  getColor(): string {
    return '#4dff4d';
  }
}

/**
 * Factory for creating PriorityStrategy instances based on TaskPriority (Factory Method Pattern).
 * This centralizes the creation logic for priority strategies.
 */
export class PriorityStrategyFactory {
  /**
   * Returns the appropriate PriorityStrategy instance for a given TaskPriority.
   * If an unknown priority is provided, it defaults to MediumPriorityStrategy.
   * @param {TaskPriority} priority - The priority level for which to get the strategy.
   * @returns {PriorityStrategy} An instance of the corresponding PriorityStrategy.
   */
  static getStrategy(priority: TaskPriority): PriorityStrategy {
    switch (priority) {
      case TaskPriority.HIGH:
        return new HighPriorityStrategy();
      case TaskPriority.MEDIUM:
        return new MediumPriorityStrategy();
      case TaskPriority.LOW:
        return new LowPriorityStrategy();
      default:
        return new MediumPriorityStrategy();
    }
  }
} 