/**
 * @file The entry point of the React application.
 * Renders the main App component into the DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * Finds the root HTML element where the React application will be mounted.
 * @type {HTMLElement} The root element, cast to HTMLElement.
 */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

/**
 * Renders the React application within a StrictMode for highlighting potential problems.
 * The main App component is rendered here.
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
