import React from 'react';
import Home from './pages/Home';
import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';

import QueryInput from './components/QueryInput';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Route path='/' exact component={QueryInput}></Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
