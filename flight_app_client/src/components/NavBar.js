import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { Switch } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { GlobalSearchStateContext } from '../utils/context';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Badge from '@material-ui/core/Badge';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LoginModal from '../pages/LoginModal';

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
  const classes = useStyles();
  const {
    adventureMode,
    firstSearch,
    setAdventureMode,
    setSearchDrawerOpen,
    searchDrawerOpen,
    setFirstSearch,
    isLoggedIn,
    checkedSavedFlights,
  } = useContext(GlobalSearchStateContext);

  const restartSearch = () => {
    setFirstSearch(true);
    setAdventureMode(!adventureMode);
  };
  console.log(checkedSavedFlights);

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
              {checkedSavedFlights ? (
                <AccountCircleIcon />
              ) : (
                <Badge
                  color='secondary'
                  overlap='circle'
                  badgeContent=''
                  variant='dot'>
                  <AccountCircleIcon />
                </Badge>
              )}
            </IconButton>
          ) : (
            <>
              {/* {pathname === '/login' ? (
                <Button component={Link} to='/signup' color='inherit'>
                  Signup
                </Button>
              ) : pathname === '/signup' ? (
                <Button component={Link} to='/login' color='inherit'>
                  Login
                </Button>
              ) : (
                <>
                  <Button component={Link} to='/login' color='inherit'>
                    Login
                  </Button>
                  <Button component={Link} to='/signup' color='inherit'>
                    Signup
                  </Button>
                </>
              )} */}
              <LoginModal />
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
