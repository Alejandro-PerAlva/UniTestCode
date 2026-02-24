/**
 * main.jsx
 * Entry point for the React application.
 * Mounts the App component and loads global styles.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import global styles (CSS Reset and Variables)
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);