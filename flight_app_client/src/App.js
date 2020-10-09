import React, { useContext, useEffect } from 'react';
import './App.css';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import NavBar from './components/NavBar';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useHistory,
} from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import { GlobalSearchStateContext } from './utils/context';
import { useQuery } from '@apollo/client';
import { GET_USER } from './gql/UserMutations';
import { useApolloClient } from '@apollo/client';

function App() {
  const client = useApolloClient();
  const history = useHistory();
  const { isLoggedIn, setIsLoggedIn, setFirstSearch } = useContext(
    GlobalSearchStateContext
  );
  const { error } = useQuery(GET_USER);
  console.log('LOCAL STORAGE:', localStorage);
  console.log('LOG IN STATUS:', isLoggedIn);

  useEffect(() => {
    if (error) {
      localStorage.clear();
      setFirstSearch(true);
      setIsLoggedIn(false);
      client
        .resetStore()
        .then(() => {
          history.push('/search');
        })
        .catch((error) => console.log(error));
    }
  }, [error]);

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
