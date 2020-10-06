import React from 'react';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import Button from '@material-ui/core/Button';

export default function SaveFlightButton() {
  return (
    <Button color='secondary' startIcon={<FavoriteBorderOutlinedIcon />}>
      Save
    </Button>
  );
}
