import React, { useContext } from 'react';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import Button from '@material-ui/core/Button';
import { GlobalSearchStateContext } from '../utils/context';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SAVE_FLIGHT_TO_USER } from '../gql/UserMutations';

export default function SaveFlightButton({ flight }) {
  const { isLoggedIn } = useContext(GlobalSearchStateContext);
  const [saveUserFlight, { data }] = useMutation(SAVE_FLIGHT_TO_USER);

  const handleSave = () => {
    console.log(flight);
    saveUserFlight({ variables: { ...flight } }).catch((error) =>
      console.log({ error })
    );
  };
  if (data) {
    console.log(data);
  }
  return (
    <>
      {isLoggedIn ? (
        <Button
          color='secondary'
          startIcon={<FavoriteBorderOutlinedIcon />}
          onClick={() => handleSave()}>
          Save
        </Button>
      ) : (
        <Button
          color='secondary'
          startIcon={<FavoriteBorderOutlinedIcon />}
          component={Link}
          to='/login'>
          Save
        </Button>
      )}
    </>
  );
}
