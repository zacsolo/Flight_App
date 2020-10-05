import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { Switch } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { GlobalSearchStateContext } from '../utils/context';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

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

export default function NavBar() {
  const { pathname } = useLocation();
  console.log(pathname);
  const classes = useStyles();
  const {
    adventureMode,
    firstSearch,
    setAdventureMode,
    setSearchDrawerOpen,
    setFirstSearch,
    isLoggedIn,
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
            {pathname !== '/search' ? (
              <IconButton
                edge='end'
                color='inherit'
                className={classes.menuButton}
                component={Link}
                onClick={() => setFirstSearch(true)}
                to='/search'>
                <SearchIcon />
              </IconButton>
            ) : (
              <FormControlLabel
                control={
                  <Switch
                    checked={adventureMode}
                    onChange={restartSearch}
                    name='simpleSearch'
                    color='default'
                  />
                }
                label='Adventure Mode'
              />
            )}
          </Typography>
          {!firstSearch && pathname === '/search' ? (
            <IconButton
              edge='end'
              color='inherit'
              className={classes.menuButton}
              onClick={() => setSearchDrawerOpen(true)}>
              <SearchIcon />
            </IconButton>
          ) : null}
          {isLoggedIn ? (
            <IconButton edge='end' color='inherit' component={Link} to='/user'>
              <AccountCircleIcon />
            </IconButton>
          ) : (
            <>
              <Button component={Link} to='/login' color='inherit'>
                Login
              </Button>
              <Button component={Link} to='/signup' color='inherit'>
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
