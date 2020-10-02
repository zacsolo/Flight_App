import React, { useEffect, useContext } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { GlobalSearchStateContext } from '../utils/context';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function TemporaryDrawer(props) {
  const { setSearchDrawerOpen } = useContext(GlobalSearchStateContext);
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: true,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setSearchDrawerOpen(open);
    setState({ ...state, [anchor]: open });
  };

  const toggleOpen = () => {
    setSearchDrawerOpen(state.top);
    setState({ ...state, top: !state.top });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role='presentation'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '16px 0px 0px 16px',
        }}>
        {React.cloneElement(props.children, { toggleOpen: toggleOpen })}
      </div>
    </div>
  );

  return (
    <div>
      {['top'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
