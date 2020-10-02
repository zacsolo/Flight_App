import React from 'react';
import GlobalSearchStateContextProvider from './utils/context';
import './App.css';
import Home from './pages/Home';

function App() {
  return (
    <GlobalSearchStateContextProvider>
      <Home />
    </GlobalSearchStateContextProvider>
  );
}

export default App;
