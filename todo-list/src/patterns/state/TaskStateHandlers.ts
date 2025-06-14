/**
 * @file Implements concrete state handlers for the TaskState (State Pattern).
 * Each handler defines the behavior of a task when it is in a specific state
 * and specifies the possible transitions to other states.
 */

import { Task, TaskState, TaskStateHandler } from '../../types';

/**
 * Handles the 'NEW' state of a task.
 * A task in this state is typically newly created and can transition to 'IN_PROGRESS'.
 */
export class NewStateHandler implements TaskStateHandler {
  /**
   * Sets the task's state to NEW.
   * @param {Task} task - The task to update.
   */
  handleState(task: Task): void {
    task.state = TaskState.NEW;
    task.updatedAt = new Date();
  }

  /**
   * Returns the next logical state from NEW, which is IN_PROGRESS.
   * @returns {TaskState.IN_PROGRESS} The next possible state.
   */
  getNextState(): TaskState {
    return TaskState.IN_PROGRESS;
  }

  /**
   * Returns null as there is no previous state from NEW.
   * @returns {null} No previous state.
   */
  getPreviousState(): TaskState | null {
    return null;
  }
}

/**
 * Handles the 'IN_PROGRESS' state of a task.
 * A task in this state can transition to 'COMPLETED' or 'NEW'.
 */
export class InProgressStateHandler implements TaskStateHandler {
  /**
   * Sets the task's state to IN_PROGRESS.
   * @param {Task} task - The task to update.
   */
  handleState(task: Task): void {
    task.state = TaskState.IN_PROGRESS;
    task.updatedAt = new Date();
  }

  /**
   * Returns the next logical state from IN_PROGRESS, which is COMPLETED.
   * @returns {TaskState.COMPLETED} The next possible state.
   */
  getNextState(): TaskState {
    return TaskState.COMPLETED;
  }

  /**
   * Returns the previous logical state from IN_PROGRESS, which is NEW.
   * @returns {TaskState.NEW} The previous possible state.
   */
  getPreviousState(): TaskState {
    return TaskState.NEW;
  }
}

/**
 * Handles the 'COMPLETED' state of a task.
 * A task in this state typically marks its completion and can transition back to 'IN_PROGRESS' for re-opening.
 */
export class CompletedStateHandler implements TaskStateHandler {
  /**
   * Sets the task's state to COMPLETED.
   * @param {Task} task - The task to update.
   */
  handleState(task: Task): void {
    task.state = TaskState.COMPLETED;
    task.updatedAt = new Date();
  }

  /**
   * Returns null as there is no next state from COMPLETED (final state).
   * @returns {null} No next state.
   */
  getNextState(): TaskState | null {
    return null;
  }

  /**
   * Returns the previous logical state from COMPLETED, which is IN_PROGRESS.
   * @returns {TaskState.IN_PROGRESS} The previous possible state.
   */
  getPreviousState(): TaskState {
    return TaskState.IN_PROGRESS;
  }
}

/**
 * Handles the 'POSTPONED' state of a task.
 * A task in this state is temporarily set aside and can transition back to 'IN_PROGRESS' or 'NEW'.
 */
export class PostponedStateHandler implements TaskStateHandler {
  /**
   * Sets the task's state to POSTPONED.
   * @param {Task} task - The task to update.
   */
  handleState(task: Task): void {
    task.state = TaskState.POSTPONED;
    task.updatedAt = new Date();
  }

  /**
   * Returns the next logical state from POSTPONED, which is IN_PROGRESS (resuming the task).
   * @returns {TaskState.IN_PROGRESS} The next possible state.
   */
  getNextState(): TaskState {
    return TaskState.IN_PROGRESS;
  }

  /**
   * Returns the previous logical state from POSTPONED, which is NEW.
   * @returns {TaskState.NEW} The previous possible state.
   */
  getPreviousState(): TaskState {
    return TaskState.NEW;
  }
} 