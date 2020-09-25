import React from 'react';
import Home from './pages/Home';
import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Route path='/' exact component={Home}></Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
