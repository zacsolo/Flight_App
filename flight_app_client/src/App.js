import React from 'react';
import GlobalSearchStateContextProvider from './utils/context';
import './App.css';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <GlobalSearchStateContextProvider>
      {/* <Home /> */}
      {/* <ProfilePage /> */}
      <LoginPage />
    </GlobalSearchStateContextProvider>
  );
}

export default App;
