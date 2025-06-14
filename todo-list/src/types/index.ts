/**
 * @file Defines core types and interfaces for the To-Do List application, 
 * including enums for task states and priorities, and interfaces for tasks,
 * state handlers, priority strategies, observers, and task factories.
 */

/**
 * Enum representing the possible states of a task.
 */
export enum TaskState {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  POSTPONED = 'POSTPONED'
}

/**
 * Enum representing the priority levels of a task.
 */
export enum TaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

/**
 * Interface representing a single To-Do task.
 * @property {string} id - Unique identifier for the task.
 * @property {string} title - The title of the task.
 * @property {string} description - A detailed description of the task.
 * @property {TaskState} state - The current state of the task.
 * @property {TaskPriority} priority - The priority level of the task.
 * @property {Date} createdAt - The timestamp when the task was created.
 * @property {Date} updatedAt - The timestamp when the task was last updated.
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  state: TaskState;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for handling specific task states (State Pattern).
 * Each implementation will define how a task behaves in a particular state
 * and what transitions are possible.
 */
export interface TaskStateHandler {
  /**
   * Applies the specific state logic to the given task.
   * @param {Task} task - The task whose state is to be handled.
   */
  handleState(task: Task): void;
  /**
   * Returns the next possible state from the current state, or null if no next state is defined.
   * @returns {TaskState | null} The next possible TaskState or null.
   */
  getNextState(): TaskState | null;
  /**
   * Returns the previous possible state from the current state, or null if no previous state is defined.
   * @returns {TaskState | null} The previous possible TaskState or null.
   */
  getPreviousState(): TaskState | null;
}

/**
 * Interface for defining priority strategies (Strategy Pattern).
 * Each implementation will define a specific priority level's behavior and visual representation.
 */
export interface PriorityStrategy {
  /**
   * Returns the numeric level of the priority.
   * @returns {number} The priority level.
   */
  getPriorityLevel(): number;
  /**
   * Returns the color associated with this priority level for UI representation.
   * @returns {string} The HEX color string.
   */
  getColor(): string;
}

/**
 * Interface for observers that react to changes in task data (Observer Pattern).
 */
export interface TaskObserver {
  /**
   * Called when the observed task data changes.
   * @param {Task[]} tasks - The updated list of tasks.
   */
  update(tasks: Task[]): void;
}

/**
 * Interface for a factory that creates task objects (Factory Pattern).
 */
export interface TaskFactory {
  /**
   * Creates a new task instance.
   * @param {string} title - The title of the new task.
   * @param {string} description - The description of the new task.
   * @param {TaskPriority} priority - The priority of the new task.
   * @returns {Task} A new Task object.
   */
  createTask(title: string, description: string, priority: TaskPriority): Task;
} 