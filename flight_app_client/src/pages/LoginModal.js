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
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import Calendar from '../media/recaps+winter.png';

//Login Modal Should be opened when a user goes to
//save a flight but is not logged in, or does not yet have
//an account
//
//Modal should also be opened when a user clicks the user icon
//Then based on their choice then can be rerouted
//
//Should sign up and login be done exclusively in the modal?
//Then if the mutation is successful close the modal?

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
  const [login, setLogin] = React.useState(false);
  const [signUp, setSignUp] = React.useState(false);

  const { loginModalOpen, setLoginModalOpen } = useContext(
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
    setLoginModalOpen(false);
    setOpen(false);
  };

  return (
    <>
      {login ? (
        <Dialog
          onClose={handleClose}
          aria-labelledby='customized-dialog-title'
          open={open}>
          <DialogTitle onClose={handleClose}>Login to your account</DialogTitle>
          <DialogContent>
            <img src={Calendar} alt='calendar' style={{ width: '100%' }} />
            <LoginPage />
          </DialogContent>
        </Dialog>
      ) : signUp ? (
        <Dialog
          onClose={handleClose}
          aria-labelledby='customized-dialog-title'
          open={open}>
          <DialogTitle id='customized-dialog-title' onClose={handleClose}>
            Join the adventure
          </DialogTitle>
          <DialogContent>
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
            <DialogContent>
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
              <Button autoFocus onClick={() => setLogin(true)} color='primary'>
                Login
              </Button>
              <Button autoFocus onClick={() => setSignUp(true)} color='primary'>
                Signup
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
}
