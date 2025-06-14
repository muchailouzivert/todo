/**
 * @file Implements a concrete factory for creating Task objects (Factory Pattern).
 */

import { v4 as uuidv4 } from 'uuid';
import { Task, TaskFactory, TaskPriority, TaskState } from '../../types';

/**
 * `ConcreteTaskFactory` is a concrete implementation of the `TaskFactory` interface.
 * It is responsible for creating and initializing new `Task` objects with default values,
 * such as a unique ID, initial state (NEW), and creation/update timestamps.
 */
export class ConcreteTaskFactory implements TaskFactory {
  /**
   * Creates a new `Task` instance.
   * @param {string} title - The title of the new task.
   * @param {string} description - The description of the new task.
   * @param {TaskPriority} priority - The priority of the new task.
   * @returns {Task} A newly created `Task` object with a unique ID, default NEW state,
   * and current timestamps for creation and last update.
   */
  createTask(title: string, description: string, priority: TaskPriority): Task {
    const now = new Date();
    return {
      id: uuidv4(),
      title,
      description,
      state: TaskState.NEW,
      priority,
      createdAt: now,
      updatedAt: now
    };
  }
} 