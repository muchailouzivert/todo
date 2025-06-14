/**
 * @file Manages task-related operations, applies design patterns (Singleton, State, Factory, Observer, Adapter),
 * and handles persistence via a flexible storage adapter.
 * This service acts as the central hub for all task business logic.
 */

import { Task, TaskPriority, TaskState, TaskStateHandler } from '../types';
import { ConcreteTaskFactory } from '../patterns/factory/TaskFactory';
import { TaskSubject } from '../patterns/observer/TaskSubject';
import { NewStateHandler, InProgressStateHandler, CompletedStateHandler, PostponedStateHandler } from '../patterns/state/TaskStateHandlers';
import { StorageAdapter } from '../adapters/StorageAdapter';
import { LocalStorageAdapter } from '../adapters/LocalStorageAdapter';

/**
 * `TaskService` is a Singleton that provides an API for managing tasks.
 * It orchestrates the use of various design patterns:
 * - **Singleton**: Ensures only one instance of TaskService exists.
 * - **Factory**: Uses `ConcreteTaskFactory` for creating new task objects.
 * - **State**: Delegates state-specific logic to `TaskStateHandler` implementations.
 * - **Observer**: Uses `TaskSubject` to notify UI components about changes in the task list.
 * - **Adapter**: Utilizes `StorageAdapter` for persistent data storage, making the storage mechanism interchangeable.
 * 
 * This class adheres to the Single Responsibility Principle (SRP) by focusing on task business logic,
 * and the Open/Closed Principle (OCP) by allowing easy extension (e.g., new states, new storage) 
 * without modifying its core logic.
 */
export class TaskService {
  private static instance: TaskService;
  private taskFactory: ConcreteTaskFactory;
  private taskSubject: TaskSubject;
  private storageAdapter: StorageAdapter;
  private readonly STORAGE_KEY = 'tasks';

  /**
   * Private constructor to enforce the Singleton pattern.
   * Initializes the task factory, task subject, and loads tasks from storage.
   * @param {StorageAdapter} [storageAdapter] - Optional storage adapter to use. Defaults to LocalStorageAdapter.
   */
  private constructor(storageAdapter?: StorageAdapter) {
    this.taskFactory = new ConcreteTaskFactory();
    this.taskSubject = new TaskSubject();
    this.storageAdapter = storageAdapter || new LocalStorageAdapter();
    this.loadTasks();
  }

  /**
   * Returns the single instance of the `TaskService` (Singleton pattern).
   * If an instance does not exist, it creates one.
   * @param {StorageAdapter} [storageAdapter] - Optional storage adapter to use for the initial instance creation.
   * @returns {TaskService} The singleton instance of TaskService.
   */
  static getInstance(storageAdapter?: StorageAdapter): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService(storageAdapter);
    }
    return TaskService.instance;
  }

  /**
   * Loads tasks from the configured storage adapter.
   * Parses the stored JSON string back into Task objects and updates the TaskSubject.
   * Dates are re-hydrated from string format.
   */
  private loadTasks(): void {
    const storedTasks = this.storageAdapter.getItem(this.STORAGE_KEY);
    if (storedTasks) {
      const tasks = JSON.parse(storedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt)
      }));
      this.taskSubject.setTasks(tasks);
    }
  }

  /**
   * Saves the current list of tasks to the configured storage adapter.
   * The task list is stringified to JSON before saving.
   */
  private saveTasks(): void {
    this.storageAdapter.setItem(this.STORAGE_KEY, JSON.stringify(this.taskSubject.getTasks()));
  }

  /**
   * Creates a new task and adds it to the task list.
   * Notifies observers and saves tasks to storage.
   * @param {string} title - The title of the new task.
   * @param {string} description - The description of the new task.
   * @param {TaskPriority} priority - The priority of the new task.
   * @returns {Task} The newly created task.
   */
  createTask(title: string, description: string, priority: TaskPriority): Task {
    const task = this.taskFactory.createTask(title, description, priority);
    const tasks = [...this.taskSubject.getTasks(), task];
    this.taskSubject.setTasks(tasks);
    this.saveTasks();
    return task;
  }

  /**
   * Updates an existing task in the list.
   * Notifies observers and saves tasks to storage.
   * The `updatedAt` timestamp of the task is automatically updated.
   * @param {Task} task - The task object with updated properties.
   */
  updateTask(task: Task): void {
    const tasks = this.taskSubject.getTasks().map(t => 
      t.id === task.id ? { ...task, updatedAt: new Date() } : t
    );
    this.taskSubject.setTasks(tasks);
    this.saveTasks();
  }

  /**
   * Deletes a task from the list by its ID.
   * Notifies observers and saves tasks to storage.
   * @param {string} taskId - The ID of the task to delete.
   */
  deleteTask(taskId: string): void {
    const tasks = this.taskSubject.getTasks().filter(t => t.id !== taskId);
    this.taskSubject.setTasks(tasks);
    this.saveTasks();
  }

  /**
   * Internal helper to get the appropriate state handler for a given TaskState.
   * @param {TaskState} state - The task state for which to get the handler.
   * @returns {TaskStateHandler | null} The state handler instance or null if not found.
   */
  private _getHandlerForState(state: TaskState): TaskStateHandler | null {
    switch (state) {
      case TaskState.NEW:
        return new NewStateHandler();
      case TaskState.IN_PROGRESS:
        return new InProgressStateHandler();
      case TaskState.COMPLETED:
        return new CompletedStateHandler();
      case TaskState.POSTPONED:
        return new PostponedStateHandler();
      default:
        return null;
    }
  }

  /**
   * Determines the next possible state for a given task based on its current state.
   * Uses the State Pattern handlers to determine valid transitions.
   * @param {Task} task - The task to check.
   * @returns {TaskState | null} The next possible TaskState or null if no transition is defined.
   */
  getPossibleNextState(task: Task): TaskState | null {
    const handler = this._getHandlerForState(task.state);
    return handler ? handler.getNextState() : null;
  }

  /**
   * Determines the previous possible state for a given task based on its current state.
   * Uses the State Pattern handlers to determine valid transitions.
   * @param {Task} task - The task to check.
   * @returns {TaskState | null} The previous possible TaskState or null if no transition is defined.
   */
  getPossiblePreviousState(task: Task): TaskState | null {
    const handler = this._getHandlerForState(task.state);
    return handler ? handler.getPreviousState() : null;
  }

  /**
   * Changes the state of a specific task.
   * Delegates the state change logic to the appropriate `TaskStateHandler`.
   * Notifies observers and saves tasks to storage after the state change.
   * @param {Task} task - The task object whose state is to be changed.
   * @param {TaskState} newState - The new state to apply to the task.
   */
  changeTaskState(task: Task, newState: TaskState): void {
    const handler = this._getHandlerForState(newState);
    if (handler) {
      handler.handleState(task);
      this.updateTask(task);
    }
  }

  /**
   * Retrieves the current list of tasks.
   * @returns {Task[]} An array of Task objects.
   */
  getTasks(): Task[] {
    return this.taskSubject.getTasks();
  }

  /**
   * Attaches a new observer to the TaskSubject.
   * @param {TaskObserver} observer - The observer to attach.
   */
  attachObserver(observer: any): void {
    this.taskSubject.attach(observer);
  }

  /**
   * Detaches an observer from the TaskSubject.
   * @param {TaskObserver} observer - The observer to detach.
   */
  detachObserver(observer: any): void {
    this.taskSubject.detach(observer);
  }
} 