/**
 * @file React component for displaying and managing a list of tasks.
 * This component allows users to filter, sort, edit, delete, and change the state of tasks.
 * It acts as an observer to the TaskService for real-time updates.
 */

import React, { useState, useEffect } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Task, TaskPriority, TaskState, TaskObserver } from '../types';
import { TaskService } from '../services/TaskService';
import { PriorityStrategyFactory } from '../patterns/strategy/PriorityStrategies';

/**
 * Props for the TaskList component.
 * @interface TaskListProps
 * @property {TaskService} taskService - The service responsible for task management.
 */
interface TaskListProps {
  taskService: TaskService;
}

/**
 * `TaskList` is a functional React component that displays tasks and provides functionalities
 * for filtering, sorting, editing, deleting, and changing task states. It observes changes
 * in the `TaskService` to keep its display synchronized with the underlying data.
 * 
 * @param {TaskListProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered task list.
 */
const TaskList: React.FC<TaskListProps> = ({ taskService }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskState | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'priority' | 'date'>('date');
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  /**
   * useEffect hook to attach and detach the component as an observer to the TaskService.
   * This ensures the task list updates whenever tasks data changes in the service.
   */
  useEffect(() => {
    const observer: TaskObserver = {
      update: (updatedTasks: Task[]) => {
        setTasks(updatedTasks);
      }
    };

    taskService.attachObserver(observer);
    setTasks(taskService.getTasks()); // Initial load of tasks

    return () => {
      taskService.detachObserver(observer);
    };
  }, [taskService]); // Dependency array includes taskService to re-run if it changes (unlikely for Singleton)

  /**
   * Handles the deletion of a task.
   * @param {string} taskId - The ID of the task to be deleted.
   */
  const handleDelete = (taskId: string) => {
    taskService.deleteTask(taskId);
  };

  /**
   * Handles the initiation of editing a task.
   * Sets the task to be edited and opens the edit dialog.
   * @param {Task} task - The task object to be edited.
   */
  const handleEdit = (task: Task) => {
    setEditTask(task);
    setEditDialogOpen(true);
  };

  /**
   * Handles saving the changes made to an edited task.
   * Updates the task via TaskService and closes the edit dialog.
   */
  const handleEditSave = () => {
    if (editTask) {
      taskService.updateTask(editTask);
      setEditDialogOpen(false);
      setEditTask(null);
    }
  };

  /**
   * Handles changing the state of a task.
   * Delegates the state change to the TaskService.
   * @param {Task} task - The task whose state is to be changed.
   * @param {TaskState} newState - The new state to set for the task.
   */
  const handleStateChange = (task: Task, newState: TaskState) => {
    taskService.changeTaskState(task, newState);
  };

  /**
   * Retrieves the color associated with a task priority.
   * Uses the PriorityStrategyFactory to get the correct strategy and its color.
   * @param {TaskPriority} priority - The priority of the task.
   * @returns {string} The HEX color string for the given priority.
   */
  const getPriorityColor = (priority: TaskPriority) => {
    return PriorityStrategyFactory.getStrategy(priority).getColor();
  };

  /**
   * Formats a TaskState enum value into a human-readable string (e.g., "In Progress").
   * @param {TaskState} state - The TaskState enum value.
   * @returns {string} The formatted state name.
   */
  const formatStateName = (state: TaskState): string => {
    const words = state.toLowerCase().replace(/_/g, ' ').split(' ');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  /**
   * Filters and sorts the tasks based on the current filter and sort criteria.
   * @type {Task[]} An array of filtered and sorted tasks.
   */
  const filteredAndSortedTasks = tasks
    .filter(task => filter === 'ALL' || task.state === filter)
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityA = PriorityStrategyFactory.getStrategy(a.priority).getPriorityLevel();
        const priorityB = PriorityStrategyFactory.getStrategy(b.priority).getPriorityLevel();
        return priorityB - priorityA; // Descending priority (High first)
      }
      // Sort by date (descending - newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        {/* Filter by State dropdown */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by State</InputLabel>
          <Select
            value={filter}
            label="Filter by State"
            onChange={(e) => setFilter(e.target.value as TaskState | 'ALL')}
          >
            <MenuItem value="ALL">All</MenuItem>
            {Object.values(TaskState).map((state) => (
              <MenuItem key={state} value={state}>
                {formatStateName(state)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Sort by dropdown */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value as 'priority' | 'date')}
          >
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="date">Date</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Task List */}
      <List>
        {filteredAndSortedTasks.map((task) => (
          <ListItem
            key={task.id}
            sx={{
              mb: 2,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'transparent' // Remove hover effect
              }
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">{task.title}</Typography>
                  <Chip
                    label={task.priority}
                    size="small"
                    sx={{
                      backgroundColor: getPriorityColor(task.priority),
                      color: 'white'
                    }}
                  />
                  <Chip
                    label={formatStateName(task.state)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              {/* Edit Task Button */}
              <IconButton
                edge="end"
                onClick={() => handleEdit(task)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              {/* Delete Task Button */}
              <IconButton
                edge="end"
                onClick={() => handleDelete(task.id)}
                sx={{ mr: 1 }}
              >
                <DeleteIcon />
              </IconButton>
              {/* Task State Change Dropdown */}
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel size="small">State</InputLabel>
                <Select
                  value={task.state}
                  onChange={(e) => handleStateChange(task, e.target.value as TaskState)}
                  label="State"
                  size="small"
                >
                  {Object.values(TaskState).map((state) => (
                    <MenuItem key={state} value={state}>
                      {formatStateName(state)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Edit Task Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          {editTask && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Title"
                value={editTask.title}
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                fullWidth
              />
              <TextField
                label="Description"
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                multiline
                rows={3}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editTask.priority}
                  label="Priority"
                  onChange={(e) => setEditTask({ ...editTask, priority: e.target.value as TaskPriority })}
                >
                  <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
                  <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
                  <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TaskList; 