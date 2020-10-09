import React, { useContext, useState } from 'react';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { GlobalSearchStateContext } from '../utils/context';
import { useMutation } from '@apollo/client';
import { SAVE_FLIGHT_TO_USER } from '../gql/UserMutations';

export default function SaveFlightButton({
  flight,
  saved,
  removeSingleFlight,
}) {
  const { isLoggedIn, setCheckedSavedFlights, setLoginModalOpen } = useContext(
    GlobalSearchStateContext
  );
  const [saveFeedBack, setSaveFeedback] = useState(false);
  const [saveUserFlight, { data }] = useMutation(SAVE_FLIGHT_TO_USER);

  const handleSave = () => {
    saveUserFlight({ variables: { ...flight } })
      .then(() => {
        setSaveFeedback(true);
        setCheckedSavedFlights(false);
      })
      .catch((error) => console.log({ error }));
  };

  const handleRemove = () => {
    removeSingleFlight({
      departureDate: flight.departureDate,
      outboundOrigin: flight.outboundOrigin,
      outboundDestination: flight.outboundDestination,
    });
  };

  if (data) {
    console.log(data);
  }

  return (
    <>
      {isLoggedIn && saved ? (
        <Button color='secondary' onClick={() => handleRemove()}>
          <DeleteIcon />
        </Button>
      ) : isLoggedIn && !saved ? (
        <Button
          color='secondary'
          startIcon={
            saveFeedBack ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />
          }
          onClick={() => handleSave()}>
          Save
        </Button>
      ) : (
        <Button
          color='secondary'
          startIcon={<FavoriteBorderOutlinedIcon />}
          onClick={() => setLoginModalOpen(true)}>
          Save
        </Button>
      )}
    </>
  );
}
