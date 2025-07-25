import React from "react";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes/AppRoutes';
import CreateTaskDrawer from './features/tasks/components/CreateTaskDrawer';
import ToastNotification from './components/UI/ToastNotification';
import "./App.css";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app">
          <AppRoutes />
          <CreateTaskDrawer />
          <ToastNotification />
        </div>
      </BrowserRouter>
    </Provider>
  );
}