import React, { useState } from 'react';
import AnywhereFlight from './pages/AnywhereFlight';
import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';

import Home from './pages/Home';
import { Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function App() {
  const [simple, setSimple] = useState(true);
  return (
    <div className='App'>
      <FormControlLabel
        control={
          <Checkbox
            checked={simple}
            onChange={() => setSimple(!simple)}
            name='simpleSearch'
            color='primary'
          />
        }
        label='Adventure Mode'
      />
      {/* <BrowserRouter>
        <Route path='/' exact component={AnywhereFlight}></Route>
        <Route path='/' exact component={Home}></Route>
      </BrowserRouter> */}
      {simple ? <AnywhereFlight /> : <Home />}
    </div>
  );
}

export default App;
