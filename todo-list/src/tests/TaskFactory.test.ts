import { ConcreteTaskFactory } from '../patterns/factory/TaskFactory';
import { TaskPriority, TaskState } from '../types';

describe('ConcreteTaskFactory', () => {
  let factory: ConcreteTaskFactory;

  beforeEach(() => {
    factory = new ConcreteTaskFactory();
  });

  test('should create a task with correct title, description, and priority', () => {
    const title = 'Test Task';
    const description = 'This is a test description.';
    const priority = TaskPriority.HIGH;
    const task = factory.createTask(title, description, priority);

    expect(task.title).toBe(title);
    expect(task.description).toBe(description);
    expect(task.priority).toBe(priority);
  });

  test('should create a task with a unique ID', () => {
    const task1 = factory.createTask('Task 1', '', TaskPriority.LOW);
    const task2 = factory.createTask('Task 2', '', TaskPriority.MEDIUM);

    expect(task1.id).toBeDefined();
    expect(task2.id).toBeDefined();
    expect(task1.id).not.toBe(task2.id);
  });

  test('should create a task with NEW state by default', () => {
    const task = factory.createTask('Default State Task', '', TaskPriority.LOW);
    expect(task.state).toBe(TaskState.NEW);
  });

  test('should set createdAt and updatedAt dates correctly', () => {
    const now = new Date();
    const task = factory.createTask('Date Test Task', '', TaskPriority.LOW);

    expect(task.createdAt).toBeInstanceOf(Date);
    expect(task.updatedAt).toBeInstanceOf(Date);
    // Allow for a small time difference for test execution
    expect(task.createdAt.getTime()).toBeCloseTo(now.getTime(), -3); 
    expect(task.updatedAt.getTime()).toBeCloseTo(now.getTime(), -3);
  });

  test('should handle empty description', () => {
    const task = factory.createTask('No Description Task', '', TaskPriority.LOW);
    expect(task.description).toBe('');
  });

  test('should handle different priority levels', () => {
    const highTask = factory.createTask('High Task', '', TaskPriority.HIGH);
    const mediumTask = factory.createTask('Medium Task', '', TaskPriority.MEDIUM);
    const lowTask = factory.createTask('Low Task', '', TaskPriority.LOW);

    expect(highTask.priority).toBe(TaskPriority.HIGH);
    expect(mediumTask.priority).toBe(TaskPriority.MEDIUM);
    expect(lowTask.priority).toBe(TaskPriority.LOW);
  });
}); 