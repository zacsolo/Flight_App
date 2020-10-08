import React, { useEffect, useContext } from 'react';
import { GET_USER } from '../gql/UserMutations';
import { Button, Paper, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useApolloClient, useQuery } from '@apollo/client';
import { GlobalSearchStateContext } from '../utils/context';
import FlightDisplayCard from '../components/FlightDisplayCard';
import { useMutation } from '@apollo/client';
import { REMOVE_FLIGHT_FROM_USER } from '../gql/UserMutations';

export default function ProfilePage() {
  const [removeUserFlight] = useMutation(REMOVE_FLIGHT_FROM_USER);
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

  const removeSingleFlight = (flight) => {
    console.log(flight);
    removeUserFlight({ variables: { ...flight } }).catch((error) =>
      console.log({ error })
    );
  };

  return (
    <div
      className='App'
      style={{
        marginTop: '50px',
        display: 'flex',
        flexDirection: 'column',
      }}>
      {data && data.getUser.savedFlights.length >= 1 ? (
        <Paper>
          <Typography variant='h4'>Welcome to your stash!</Typography>
          <Typography variant='subtitle2' color='textSecondary'>
            Here's what's changed since last time
          </Typography>
          <Button color='primary' type='submit' onClick={logoutReset}>
            Sign out
          </Button>
        </Paper>
      ) : (
        <Paper elevation={2}>
          <Typography variant='h4'>Welcome to your stash!</Typography>
          <Typography variant='subtitle2' color='textSecondary'>
            Looks like you haven't saved any flights yet!
          </Typography>
          <div>
            <Button
              size='large'
              color='secondary'
              onClick={() => history.push('/search')}
              style={{ marginTop: '25px' }}>
              Start a new search
            </Button>
          </div>
          <Button
            size='small'
            color='primary'
            type='submit'
            onClick={logoutReset}>
            Sign out
          </Button>
        </Paper>
      )}

      {data &&
        data.getUser.savedFlights.map((flight) => (
          <FlightDisplayCard
            flight={flight}
            key={`${flight.price}${flight.departureDate}`}
            saved={true}
            removeSingleFlight={removeSingleFlight}
          />
        ))}
    </div>
  );
}
