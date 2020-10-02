import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { GlobalSearchStateContext } from '../utils/context';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Home() {
  const classes = useStyles();
  const {
    adventureMode,
    firstSearch,
    setAdventureMode,
    setSearchDrawerOpen,
    setFirstSearch,
  } = useContext(GlobalSearchStateContext);

  const restartSearch = () => {
    setFirstSearch(true);
    setAdventureMode(!adventureMode);
  };
  return (
    <div className={classes.root}>
      <AppBar position='fixed' color={adventureMode ? 'secondary' : 'primary'}>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={adventureMode}
                  onChange={restartSearch}
                  name='simpleSearch'
                  color='grey'
                />
              }
              label='Adventure Mode'
            />
          </Typography>
          {!firstSearch && (
            <IconButton
              edge='end'
              color='inherit'
              className={classes.menuButton}
              onClick={() => setSearchDrawerOpen(true)}>
              <SearchIcon />
            </IconButton>
          )}
          <Button color='inherit'>Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
