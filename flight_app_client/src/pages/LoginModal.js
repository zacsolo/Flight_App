import React from 'react';
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
import { Image } from '@material-ui/core';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

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
      <Typography variant='h6'>{children}</Typography>
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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton edge='end' color='inherit' onClick={handleClickOpen}>
        <AccountCircleIcon />
      </IconButton>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}>
        <DialogTitle
          id='customized-dialog-title'
          onClose={handleClose}></DialogTitle>
        <DialogContent>
          <img src={surferImage} alt='surfer' style={{ width: '100%' }} />
          <Typography variant='h5' color='primary' align='center' gutterBottom>
            Get the full experience
          </Typography>
          <Typography color='textSecondary' align='center' gutterBottom>
            Track prices, make trip planning easier, and enjoy faster booking.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color='primary'>
            Login
          </Button>
          <Button autoFocus onClick={handleClose} color='primary'>
            Signup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
