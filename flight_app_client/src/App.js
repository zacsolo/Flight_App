import React, { useContext } from 'react';
import GlobalSearchStateContextProvider from './utils/context';
import './App.css';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import NavBar from './components/NavBar';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import { GlobalSearchStateContext } from './utils/context';

function App() {
  const { isLoggedIn } = useContext(GlobalSearchStateContext);
  console.log('LOCAL STORAGE:', localStorage);
  console.log('LOG IN STATUS:', isLoggedIn);
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path='/search'>{<Home />}</Route>

        <Route path='/user'>
          {isLoggedIn ? <ProfilePage /> : <Redirect to='/search' />}
        </Route>

        <Route path='/login'>
          {isLoggedIn ? <Redirect to='/search' /> : <LoginPage />}
        </Route>
        <Route path='/signup'>
          {isLoggedIn ? <Redirect to='/search' /> : <SignUpPage />}
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
