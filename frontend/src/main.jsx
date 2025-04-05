// frontend/src/main.jsx
// Importing necessary dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';
import Routing from './routes/Routing';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './Redux/store';
import './index.css';
import { Toaster } from "./components/ui/toaster.jsx"; 


ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    {/* PersistGate ensures that the Redux store state persists between page reloads */}
    <PersistGate loading={null} persistor={persistor}>
      {/* Routing component handles all route configurations */}
      <Routing />
      {/* Toaster component renders UI notifications (e.g., success/error messages) */}
      <Toaster />
    </PersistGate>
  </React.StrictMode>,
);
