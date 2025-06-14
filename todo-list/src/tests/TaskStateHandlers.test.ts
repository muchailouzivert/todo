import { Task, TaskState } from '../types';
import { NewStateHandler, InProgressStateHandler, CompletedStateHandler, PostponedStateHandler } from '../patterns/state/TaskStateHandlers';

describe('Task State Handlers', () => {
  let task: Task;

  beforeEach(() => {
    task = {
      id: '1',
      title: 'Test Task',
      description: 'Some description',
      state: TaskState.NEW,
      priority: null as any, // Will be set by specific tests if needed
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  describe('NewStateHandler', () => {
    const handler = new NewStateHandler();

    test('should set task state to NEW', () => {
      handler.handleState(task);
      expect(task.state).toBe(TaskState.NEW);
    });

    test('should return IN_PROGRESS as next state', () => {
      expect(handler.getNextState()).toBe(TaskState.IN_PROGRESS);
    });

    test('should return null as previous state', () => {
      expect(handler.getPreviousState()).toBeNull();
    });

    test('should update updatedAt timestamp', () => {
      const initialUpdatedAt = task.updatedAt;
      handler.handleState(task);
      expect(task.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });
  });

  describe('InProgressStateHandler', () => {
    const handler = new InProgressStateHandler();

    test('should set task state to IN_PROGRESS', () => {
      handler.handleState(task);
      expect(task.state).toBe(TaskState.IN_PROGRESS);
    });

    test('should return COMPLETED as next state', () => {
      expect(handler.getNextState()).toBe(TaskState.COMPLETED);
    });

    test('should return NEW as previous state', () => {
      expect(handler.getPreviousState()).toBe(TaskState.NEW);
    });

    test('should update updatedAt timestamp', () => {
      const initialUpdatedAt = task.updatedAt;
      handler.handleState(task);
      expect(task.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });
  });

  describe('CompletedStateHandler', () => {
    const handler = new CompletedStateHandler();

    test('should set task state to COMPLETED', () => {
      handler.handleState(task);
      expect(task.state).toBe(TaskState.COMPLETED);
    });

    test('should return null as next state', () => {
      expect(handler.getNextState()).toBeNull();
    });

    test('should return IN_PROGRESS as previous state', () => {
      expect(handler.getPreviousState()).toBe(TaskState.IN_PROGRESS);
    });

    test('should update updatedAt timestamp', () => {
      const initialUpdatedAt = task.updatedAt;
      handler.handleState(task);
      expect(task.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });
  });

  describe('PostponedStateHandler', () => {
    const handler = new PostponedStateHandler();

    test('should set task state to POSTPONED', () => {
      handler.handleState(task);
      expect(task.state).toBe(TaskState.POSTPONED);
    });

    test('should return IN_PROGRESS as next state', () => {
      expect(handler.getNextState()).toBe(TaskState.IN_PROGRESS);
    });

    test('should return NEW as previous state', () => {
      expect(handler.getPreviousState()).toBe(TaskState.NEW);
    });

    test('should update updatedAt timestamp', () => {
      const initialUpdatedAt = task.updatedAt;
      handler.handleState(task);
      expect(task.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });
  });
}); 