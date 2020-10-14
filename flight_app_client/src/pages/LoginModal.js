import React, { useContext, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import surferImage from '../media/Surfer.png';
import { GlobalSearchStateContext } from '../utils/context';

import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import Calendar from '../media/recaps+winter.png';

//FAR OUT MODE
//there should be an error when a user searches for a flight
//too far in the future.
//
//Say something like
//"Far out dude!"
//'(but seriously, your search returned no results and was probably too far in the future)'
// then redirect them back to the home page
// use astronaut picture as well

//
//When modal is existed after a search
//the search results disappear. This shouldnt happen.
//If you choose not to log in, your search should remain on the screen
//

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    // height: '70vh',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography color='primary' variant='h6'>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function LoginModal() {
  const [open, setOpen] = React.useState(false);
  const [loginModalPage, setLoginModalPage] = React.useState(false);
  const [signUpModalPage, setSignUpModalPage] = React.useState(false);

  const { loginModalOpen, setLoginModalOpen, setFirstSearch } = useContext(
    GlobalSearchStateContext
  );

  useEffect(() => {
    if (loginModalOpen) {
      setOpen(true);
    }
  }, [loginModalOpen]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setFirstSearch(true);
    setLoginModalOpen(false);
    setOpen(false);
  };

  return (
    <>
      {loginModalPage ? (
        <Dialog
          onClose={handleClose}
          aria-labelledby='customized-dialog-title'
          open={open}>
          <DialogTitle onClose={handleClose}>Login to your account</DialogTitle>
          <DialogContent style={{ minHeight: '45vh' }}>
            <img src={Calendar} alt='calendar' style={{ width: '100%' }} />

            <LoginPage />
          </DialogContent>
        </Dialog>
      ) : signUpModalPage ? (
        <Dialog
          onClose={handleClose}
          aria-labelledby='customized-dialog-title'
          open={open}>
          <DialogTitle id='customized-dialog-title' onClose={handleClose}>
            Join the adventure
          </DialogTitle>
          <DialogContent style={{ minHeight: '35vh' }}>
            <img src={Calendar} alt='calendar' style={{ width: '100%' }} />
            <SignUpPage />
          </DialogContent>
        </Dialog>
      ) : (
        <>
          <Dialog
            onClose={handleClose}
            aria-labelledby='customized-dialog-title'
            open={open}>
            <DialogTitle
              id='customized-dialog-title'
              onClose={handleClose}></DialogTitle>
            <DialogContent style={{ minHeight: '35vh' }}>
              <img src={surferImage} alt='surfer' style={{ width: '100%' }} />
              <Typography
                variant='h5'
                color='primary'
                align='center'
                gutterBottom>
                Get the full experience
              </Typography>
              <Typography color='textSecondary' align='center' gutterBottom>
                Track prices, make trip planning easier, and enjoy faster
                booking.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={() => setLoginModalPage(true)}
                color='primary'>
                Login
              </Button>
              <Button
                autoFocus
                onClick={() => setSignUpModalPage(true)}
                color='primary'>
                Signup
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
}
