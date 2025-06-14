/**
 * @file The main application component, responsible for setting up the Material-UI theme,
 * header, and integrating the TaskForm and TaskList components.
 */

import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box, AppBar, Toolbar, Typography } from '@mui/material';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { TaskService } from './services/TaskService';

/**
 * Defines the Material-UI theme for the application.
 * Configured for dark mode with custom primary, secondary, and background colors.
 * Also sets the default font family to Roboto.
 */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Light blue for dark mode primary
    },
    secondary: {
      main: '#f48fb1', // Light pink for dark mode secondary
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

/**
 * The main `App` component that serves as the entry point for the application's UI.
 * It sets up the theming, provides a responsive container, and renders the task management components.
 */
const App: React.FC = () => {
  // Retrieves the singleton instance of TaskService to manage task data throughout the application.
  const taskService = TaskService.getInstance();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Applies a consistent baseline for CSS across browsers */}
      <AppBar position="static"> {/* Application header */}
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            To-Do List Application
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md"> {/* Limits the content width for better readability */}
        <Box sx={{ my: 4 }}> {/* Adds vertical margin around the main content */}
          <TaskForm taskService={taskService} />
          <TaskList taskService={taskService} />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
