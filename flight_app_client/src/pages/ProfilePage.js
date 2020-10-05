import React, { useEffect, useContext } from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { GlobalSearchStateContext } from '../utils/context';

export default function ProfilePage() {
  const client = useApolloClient();
  const history = useHistory();
  const { isLoggedIn, setIsLoggedIn, setFirstSearch } = useContext(
    GlobalSearchStateContext
  );

  //Not exactly sure where to do this
  //
  //Append the user Id to the end of the "/user:id"
  //Take the token returned and use JWT to decode and get off the ID
  //then compare the two
  //if they match, return all the saved items for that user, otherwise error.
  //
  //In effect, you cant just type in an ID to the end of a URL and see all
  //of someones saved flights. You need to have the proper token that matches that ID
  //
  //Clear the Apollo Cache, because it saves the password with each mutation
  //Not just on logout, but clear it effectively when a user logs in
  //
  //
  //RESET FUNCTION

  const logoutReset = async () => {
    localStorage.clear();
    setFirstSearch(true);
    await client.resetStore();
    setIsLoggedIn(false);
    history.push('/search');
  };

  return (
    <div>
      <div style={{ marginTop: '80px' }}>
        <ul>
          <h3>Welcome to your stash!</h3>
          <h4>Here's whats changed since you last looked</h4>
          <li>
            <div>Flight Card</div>
            <div>Flight Increased: $10 since last check</div>
          </li>
          <li>
            <div>Flight Card</div>
            <div>Flight Decreased: $90 since last check</div>
          </li>
        </ul>
      </div>
      <Button color='primary' type='submit' onClick={logoutReset}>
        Sign out
      </Button>
    </div>
  );
}
