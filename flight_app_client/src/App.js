import React from 'react';
import GlobalSearchStateContextProvider from './utils/context';
import './App.css';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import NavBar from './components/NavBar';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';

function App() {
  console.log('rendering');
  return (
    <BrowserRouter>
      <GlobalSearchStateContextProvider>
        <NavBar />
        <Switch>
          <Route path='/search' component={Home}></Route>
          <Route path='/login' component={LoginPage}></Route>
          <Route path='/user' component={ProfilePage}></Route>
          <Route path='/signup' component={SignUpPage}></Route>
        </Switch>
      </GlobalSearchStateContextProvider>
    </BrowserRouter>
  );
}

export default App;
