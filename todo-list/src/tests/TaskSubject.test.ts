import { TaskSubject } from '../patterns/observer/TaskSubject';
import { Task, TaskObserver, TaskState, TaskPriority } from '../types';

describe('TaskSubject', () => {
  let subject: TaskSubject;
  let mockTask1: Task;
  let mockTask2: Task;

  beforeEach(() => {
    subject = new TaskSubject();
    mockTask1 = {
      id: '1',
      title: 'Task 1',
      description: 'Desc 1',
      state: TaskState.NEW,
      priority: TaskPriority.MEDIUM,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockTask2 = {
      id: '2',
      title: 'Task 2',
      description: 'Desc 2',
      state: TaskState.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  test('should attach an observer', () => {
    const observer: TaskObserver = { update: jest.fn() };
    subject.attach(observer);
    // Check internal state (not ideal for black-box testing, but for demonstration)
    expect((subject as any).observers.length).toBe(1);
  });

  test('should detach an observer', () => {
    const observer1: TaskObserver = { update: jest.fn() };
    const observer2: TaskObserver = { update: jest.fn() };
    subject.attach(observer1);
    subject.attach(observer2);
    expect((subject as any).observers.length).toBe(2);

    subject.detach(observer1);
    expect((subject as any).observers.length).toBe(1);
    expect((subject as any).observers).not.toContain(observer1);
    expect((subject as any).observers).toContain(observer2);
  });

  test('should notify all attached observers when setTasks is called', () => {
    const observer1: TaskObserver = { update: jest.fn() };
    const observer2: TaskObserver = { update: jest.fn() };
    subject.attach(observer1);
    subject.attach(observer2);

    const tasks = [mockTask1];
    subject.setTasks(tasks);

    expect(observer1.update).toHaveBeenCalledTimes(1);
    expect(observer1.update).toHaveBeenCalledWith(tasks);
    expect(observer2.update).toHaveBeenCalledTimes(1);
    expect(observer2.update).toHaveBeenCalledWith(tasks);
  });

  test('should notify observers when notify is called explicitly', () => {
    const observer: TaskObserver = { update: jest.fn() };
    subject.attach(observer);
    (subject as any).tasks = [mockTask1]; // Manually set tasks for explicit notify test

    subject.notify();
    expect(observer.update).toHaveBeenCalledTimes(1);
    expect(observer.update).toHaveBeenCalledWith([mockTask1]);
  });

  test('should correctly return tasks using getTasks', () => {
    const tasks = [mockTask1, mockTask2];
    subject.setTasks(tasks);
    expect(subject.getTasks()).toEqual(tasks);
  });

  test('should not notify detached observers', () => {
    const observer1: TaskObserver = { update: jest.fn() };
    const observer2: TaskObserver = { update: jest.fn() };
    subject.attach(observer1);
    subject.attach(observer2);
    subject.detach(observer1);

    const tasks = [mockTask2];
    subject.setTasks(tasks);

    expect(observer1.update).not.toHaveBeenCalled();
    expect(observer2.update).toHaveBeenCalledTimes(1);
    expect(observer2.update).toHaveBeenCalledWith(tasks);
  });

  test('should handle no observers gracefully', () => {
    const tasks = [mockTask1];
    expect(() => subject.setTasks(tasks)).not.toThrow();
    expect(subject.getTasks()).toEqual(tasks);
  });

  test('should set and retrieve multiple tasks correctly', () => {
    const tasks = [mockTask1, mockTask2];
    subject.setTasks(tasks);
    expect(subject.getTasks().length).toBe(2);
    expect(subject.getTasks()[0].title).toBe('Task 1');
    expect(subject.getTasks()[1].state).toBe(TaskState.IN_PROGRESS);
  });
}); 