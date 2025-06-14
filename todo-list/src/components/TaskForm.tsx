/**
 * @file React component for adding new tasks to the To-Do list.
 * This form allows users to input a task title, description, and select a priority level.
 */

import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import { TaskPriority } from '../types';
import { TaskService } from '../services/TaskService';

/**
 * Props for the TaskForm component.
 * @interface TaskFormProps
 * @property {TaskService} taskService - The service responsible for task management.
 */
interface TaskFormProps {
  taskService: TaskService;
}

/**
 * `TaskForm` is a functional React component that provides an interface for creating new tasks.
 * It utilizes Material-UI components for a consistent look and feel.
 * 
 * @param {TaskFormProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered task form.
 */
const TaskForm: React.FC<TaskFormProps> = ({ taskService }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const theme = useTheme();

  /**
   * Handles the form submission event.
   * Prevents default form submission, creates a new task via TaskService if title is not empty,
   * and resets the form fields.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      taskService.createTask(title, description, priority);
      setTitle('');
      setDescription('');
      setPriority(TaskPriority.MEDIUM);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Task
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
              <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
              <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: theme.palette.grey[700], '&:hover': { backgroundColor: theme.palette.grey[800] } }}
            fullWidth
          >
            Add Task
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default TaskForm; 