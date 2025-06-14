# To-Do List Application

A flexible and extensible To-Do List application built with React, TypeScript, and Material-UI. The application implements various design patterns to manage task states, priorities, and updates.

## Features

- Add, edit, and delete tasks
- Set task priorities (High, Medium, Low)
- Manage task states (New, In Progress, Completed, Postponed)
- Filter tasks by state
- Sort tasks by priority or creation date
- Persistent storage using localStorage
- Modern and intuitive user interface

## Design Patterns Used

1. **State Pattern**: Manages task states and their transitions
2. **Strategy Pattern**: Handles task priorities and their visual representation
3. **Factory Pattern**: Creates new tasks with default values
4. **Observer Pattern**: Notifies UI components about task updates

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Application

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Usage

1. **Adding a Task**
   - Fill in the task title (required)
   - Add an optional description
   - Select a priority level
   - Click "Add Task"

2. **Managing Tasks**
   - Use the filter dropdown to view tasks by state
   - Sort tasks by priority or creation date
   - Edit task details by clicking the edit icon
   - Delete tasks using the delete icon
   - Change task state using the arrow icons

3. **Task States**
   - New: Initial state for new tasks
   - In Progress: Task is being worked on
   - Completed: Task is finished
   - Postponed: Task is temporarily set aside

## Extending the Application

The application is designed to be easily extensible. You can:

1. Add new task states by implementing the `TaskStateHandler` interface
2. Create new priority levels by implementing the `PriorityStrategy` interface
3. Add new features like deadlines or categories by extending the `Task` interface
4. Implement different storage strategies by modifying the `TaskService`

## Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## License

This project is licensed under the MIT License. 