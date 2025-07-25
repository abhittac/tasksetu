
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import AppRoutes from './routes/AppRoutes';
import ToastNotification from './components/UI/ToastNotification';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <AppRoutes />
          <ToastNotification />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
