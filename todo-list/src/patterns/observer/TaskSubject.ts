/**
 * @file Implements the Subject part of the Observer Pattern for task data.
 * This class maintains a list of observers and notifies them of any changes in the task collection.
 */

import { Task, TaskObserver } from '../../types';

/**
 * `TaskSubject` is the observable entity in the Observer Pattern.
 * It holds the current list of tasks and manages observers that are interested in task data changes.
 * When the tasks list is updated, all attached observers are notified.
 */
export class TaskSubject {
  private observers: TaskObserver[] = [];
  private tasks: Task[] = [];

  /**
   * Attaches an observer to the subject.
   * The observer will be notified of task list changes.
   * @param {TaskObserver} observer - The observer to attach.
   */
  attach(observer: TaskObserver): void {
    this.observers.push(observer);
  }

  /**
   * Detaches an observer from the subject.
   * The observer will no longer receive notifications of task list changes.
   * @param {TaskObserver} observer - The observer to detach.
   */
  detach(observer: TaskObserver): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Notifies all attached observers about the current state of the task list.
   * This method is typically called after the task list has been modified.
   */
  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.tasks);
    }
  }

  /**
   * Sets the current list of tasks and notifies all attached observers.
   * This is the primary method to update tasks and trigger UI refreshes.
   * @param {Task[]} tasks - The new list of tasks.
   */
  setTasks(tasks: Task[]): void {
    this.tasks = tasks;
    this.notify();
  }

  /**
   * Returns the current list of tasks held by the subject.
   * @returns {Task[]} The current array of Task objects.
   */
  getTasks(): Task[] {
    return this.tasks;
  }
} 