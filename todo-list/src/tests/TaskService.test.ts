import { TaskService } from '../services/TaskService';
import { LocalStorageAdapter } from '../adapters/LocalStorageAdapter';
import { TaskPriority, TaskState, Task } from '../types';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockStorageAdapter: LocalStorageAdapter;

  // Mock localStorage for TaskService tests
  const MOCK_STORAGE: { [key: string]: string } = {};
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => MOCK_STORAGE[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          MOCK_STORAGE[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete MOCK_STORAGE[key];
        }),
        clear: jest.fn(() => {
          for (const key in MOCK_STORAGE) {
            delete MOCK_STORAGE[key];
          }
        }),
      },
      writable: true,
    });
  });

  beforeEach(() => {
    // Ensure TaskService is a new instance for each test
    (TaskService as any).instance = undefined; 
    
    mockStorageAdapter = new LocalStorageAdapter();
    jest.spyOn(mockStorageAdapter, 'getItem');
    jest.spyOn(mockStorageAdapter, 'setItem');
    jest.spyOn(mockStorageAdapter, 'removeItem');
    
    window.localStorage.clear();
    jest.clearAllMocks();

    taskService = TaskService.getInstance(mockStorageAdapter);
  });

  test('should create a task and notify observers', () => {
    const observer = { update: jest.fn() };
    taskService.attachObserver(observer);

    const initialTasksCount = taskService.getTasks().length;
    taskService.createTask('New Task', 'Description', TaskPriority.HIGH);

    expect(taskService.getTasks().length).toBe(initialTasksCount + 1);
    expect(observer.update).toHaveBeenCalledTimes(1);
    expect(mockStorageAdapter.setItem).toHaveBeenCalledTimes(1);
  });

  test('should update a task and notify observers', () => {
    const observer = { update: jest.fn() };
    taskService.attachObserver(observer);

    const task = taskService.createTask('Task to update', '', TaskPriority.MEDIUM);
    const updatedTitle = 'Updated Task Title';
    const updatedTask = { ...task, title: updatedTitle };
    
    observer.update.mockClear(); // Clear initial notification
    taskService.updateTask(updatedTask);

    expect(taskService.getTasks()[0].title).toBe(updatedTitle);
    expect(observer.update).toHaveBeenCalledTimes(1);
    expect(mockStorageAdapter.setItem).toHaveBeenCalledTimes(2); // Initial create + update
  });

  test('should delete a task and notify observers', () => {
    const observer = { update: jest.fn() };
    taskService.attachObserver(observer);

    const task = taskService.createTask('Task to delete', '', TaskPriority.LOW);
    const initialTasksCount = taskService.getTasks().length;
    
    observer.update.mockClear(); // Clear initial notification
    taskService.deleteTask(task.id);

    expect(taskService.getTasks().length).toBe(initialTasksCount - 1);
    expect(observer.update).toHaveBeenCalledTimes(1);
    expect(mockStorageAdapter.setItem).toHaveBeenCalledTimes(2); // Initial create + delete
  });

  test('should change task state and notify observers', () => {
    const observer = { update: jest.fn() };
    taskService.attachObserver(observer);

    const task = taskService.createTask('State Change Task', '', TaskPriority.MEDIUM);
    
    observer.update.mockClear(); // Clear initial notification
    taskService.changeTaskState(task, TaskState.IN_PROGRESS);

    expect(task.state).toBe(TaskState.IN_PROGRESS);
    expect(observer.update).toHaveBeenCalledTimes(1);
    expect(mockStorageAdapter.setItem).toHaveBeenCalledTimes(2); // Initial create + state change
  });

  test('should load tasks from storage on initialization', () => {
    const storedTasks = [
      {
        id: 'stored1',
        title: 'Stored Task 1',
        description: '',
        state: TaskState.NEW,
        priority: TaskPriority.LOW,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    window.localStorage.setItem('tasks', JSON.stringify(storedTasks));
    
    // Re-initialize service to simulate fresh load
    (TaskService as any).instance = undefined;
    const newServiceInstance = TaskService.getInstance(mockStorageAdapter);

    expect(newServiceInstance.getTasks().length).toBe(1);
    expect(newServiceInstance.getTasks()[0].title).toBe('Stored Task 1');
    expect(mockStorageAdapter.getItem).toHaveBeenCalledTimes(1);
  });

  test('should return possible next state', () => {
    const task: Task = { ...taskService.createTask('Task', '', TaskPriority.LOW), state: TaskState.NEW };
    expect(taskService.getPossibleNextState(task)).toBe(TaskState.IN_PROGRESS);
  });

  test('should return possible previous state', () => {
    const task: Task = { ...taskService.createTask('Task', '', TaskPriority.LOW), state: TaskState.IN_PROGRESS };
    expect(taskService.getPossiblePreviousState(task)).toBe(TaskState.NEW);
  });

  test('should handle attaching and detaching multiple observers', () => {
    const observer1 = { update: jest.fn() };
    const observer2 = { update: jest.fn() };

    taskService.attachObserver(observer1);
    taskService.attachObserver(observer2);
    taskService.createTask('Multi Observer Task', '', TaskPriority.HIGH);

    expect(observer1.update).toHaveBeenCalledTimes(1);
    expect(observer2.update).toHaveBeenCalledTimes(1);

    taskService.detachObserver(observer1);
    taskService.createTask('Another Multi Observer Task', '', TaskPriority.HIGH);

    expect(observer1.update).toHaveBeenCalledTimes(1); // Should not be called again
    expect(observer2.update).toHaveBeenCalledTimes(2);
  });

  test('should update task updatedAt field on state change', () => {
    const task = taskService.createTask('Update Time Task', '', TaskPriority.LOW);
    const initialUpdatedAt = task.updatedAt.getTime();

    // Advance timers for accurate comparison if using fake timers
    jest.useFakeTimers();
    jest.advanceTimersByTime(1000);

    taskService.changeTaskState(task, TaskState.IN_PROGRESS);
    const updatedTask = taskService.getTasks().find(t => t.id === task.id);

    expect(updatedTask?.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt);

    jest.useRealTimers();
  });
}); 