import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  formWrapper: {
    textAlign: (drawer) => drawer && 'center',
    marginTop: (drawer) => drawer && '16px',
  },
  formDisplay: {
    maxWidth: (drawer) => (drawer ? '100%' : '70%'),
    minWidth: (drawer) => (drawer ? '100%' : '370px'),
    margin: '0 auto',
    paddingTop: 5,
    borderRadius: 15,
  },
  formContainer: {
    marginBottom: (drawer) => !drawer && '25px',
  },
  checkboxWrapper: { margin: '0 auto' },
  formSearchButton: {
    marginTop: (drawer) => (drawer ? 20 : -20),
    borderRadius: 20,
    marginBottom: (drawer) => (drawer ? 20 : 0),
  },
});
