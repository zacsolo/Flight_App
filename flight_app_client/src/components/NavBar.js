import React, { useContext } from 'react';
import { GlobalSearchStateContext } from '../utils/context';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useStyles } from './styles/StyledNavBar';
//
//MUI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Switch from '@material-ui/core/Switch';
import Badge from '@material-ui/core/Badge';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function NavBar() {
  const { pathname } = useLocation();
  const classes = useStyles();
  const {
    adventureMode,
    firstSearch,
    setAdventureMode,
    isLoggedIn,
    checkedSavedFlights,
    setLoginModalOpen,
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
            {pathname !== '/search' ? (
              // we are on the home page
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
              // we are not on the home page
              <FormControlLabel
                control={
                  <Switch
                    checked={adventureMode}
                    onChange={restartSearch}
                    name='simpleSearch'
                    color='default'
                  />
                }
                label={adventureMode ? 'Engaged!' : 'Explore'}
              />
            )}
          </Typography>
          {/* // */}
          {/* For the follow up search icon on the right */}
          {!firstSearch && pathname === '/search' && (
            <IconButton
              edge='end'
              color='inherit'
              className={classes.menuButton}
              onClick={() => setSearchDrawerOpen(true)}>
              <SearchIcon />
            </IconButton>
          )}
          {/* // */}
          {/* For the Profile Button on the far right */}
          {isLoggedIn ? (
            <IconButton edge='end' color='inherit' component={Link} to='/user'>
              {checkedSavedFlights ? (
                <AccountCircleIcon />
              ) : (
                <Badge
                  color={adventureMode ? 'primary' : 'secondary'}
                  overlap='circle'
                  badgeContent=''
                  variant='dot'>
                  <AccountCircleIcon />
                </Badge>
              )}
            </IconButton>
          ) : (
            <IconButton
              edge='end'
              color='inherit'
              onClick={() => setLoginModalOpen(true)}>
              <AccountCircleIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
