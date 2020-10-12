import React, { useEffect, useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { GET_USER } from '../gql/UserMutations';
import { Button, Paper, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useApolloClient, useQuery } from '@apollo/client';
import { GlobalSearchStateContext } from '../utils/context';
import SimplifiedFlightCard from '../components/SimplifiedFlightCard';
import { useMutation } from '@apollo/client';
import { REMOVE_FLIGHT_FROM_USER } from '../gql/UserMutations';
import LookToSky from '../media/illustration-flights-desktop.svg';

export default function ProfilePage() {
  const route = useRouteMatch();
  const [removeUserFlight] = useMutation(REMOVE_FLIGHT_FROM_USER);
  const { data, error } = useQuery(GET_USER);
  const client = useApolloClient();
  const history = useHistory();
  const { setIsLoggedIn, setFirstSearch, setCheckedSavedFlights } = useContext(
    GlobalSearchStateContext
  );

  //Current Problem
  //If a user logs out, and another user creates an account directly
  //after, the old user info is still saved somewhere (presumably apollo cache)
  //
  //So all the old users info is still in the new users "vault"

  useEffect(() => {
    if (route.path === '/user') {
      setCheckedSavedFlights(true);
    }
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
  }, []);

  const logoutReset = () => {
    client
      .resetStore()
      .then(() => {
        localStorage.clear();
      })
      .then(() => {
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
    <>
      <img
        src={LookToSky}
        alt='looking at sky'
        style={{ width: '100%', marginTop: 55 }}
      />
      <div
        className='App'
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        {data && data.getUser.savedFlights.length >= 1 ? null : (
          // <Paper>
          //   <Typography variant='h3' style={{ color: '#3C4043' }}>
          //     Tracked prices
          //   </Typography>

          //   <Typography variant='subtitle2' color='textSecondary'>
          //     Here's what's changed since your last visit
          //   </Typography>
          // </Paper>
          <Paper elevation={2}>
            <Typography variant='h4'>Welcome to your stash!</Typography>
            <Typography variant='subtitle2' color='textSecondary'>
              Looks like you haven't saved any flights yet!
            </Typography>
            <div>
              <Button
                size='large'
                color='secondary'
                onClick={() => {
                  setFirstSearch(true);
                  history.push('/search');
                }}
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
            <SimplifiedFlightCard
              flight={flight}
              key={`${flight.price}${flight.departureDate}`}
              saved={true}
              removeSingleFlight={removeSingleFlight}
            />
          ))}
        <Button color='primary' type='submit' onClick={logoutReset}>
          Sign out
        </Button>
      </div>
    </>
  );
}
