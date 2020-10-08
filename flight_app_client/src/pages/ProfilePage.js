import React, { useEffect, useContext } from 'react';
import { GET_USER } from '../gql/UserMutations';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useApolloClient, useQuery } from '@apollo/client';
import { GlobalSearchStateContext } from '../utils/context';
import FlightDisplayCard from '../components/FlightDisplayCard';

export default function ProfilePage() {
  const { data } = useQuery(GET_USER);
  const client = useApolloClient();
  const history = useHistory();
  const { setIsLoggedIn, setFirstSearch } = useContext(
    GlobalSearchStateContext
  );

  const logoutReset = () => {
    client.resetStore().then(() => {
      localStorage.clear();
      setFirstSearch(true);
      setIsLoggedIn(false);
      history.push('/search');
    });
  };

  return (
    <div>
      <div style={{ marginTop: '80px' }}>
        {data && (
          <ul>
            <h3>Welcome to your stash!</h3>
            <h4>Here's whats changed since you last looked</h4>
            <li>
              {data.getUser.savedFlights.map((flight) => (
                <FlightDisplayCard
                  flight={flight}
                  key={`${flight.price}${flight.departureDate}`}
                />
              ))}
              <div>Flight Increased: $10 since last check</div>
            </li>
          </ul>
        )}
      </div>
      <Button color='primary' type='submit' onClick={logoutReset}>
        Sign out
      </Button>
    </div>
  );
}
