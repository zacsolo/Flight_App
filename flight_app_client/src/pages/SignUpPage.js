import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalSearchStateContext } from '../utils/context';
import ControlUserSubmit from '../utils/ControlUserSubmit';
//
//MUI
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { FormHelperText } from '@material-ui/core';

export default function SignUpPage() {
  const history = useHistory();
  const { isLoggedIn, setIsLoggedIn, setFirstSearch } = useContext(
    GlobalSearchStateContext
  );

  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { handleSubmit, data, errors, message } = ControlUserSubmit(formState);

  useEffect(() => {
    if (data || isLoggedIn) {
      setFirstSearch(true);
      setIsLoggedIn(true);
      history.push('/search');
    }
  }, [data]);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  if (data) {
    localStorage.setItem('userToken', data.signup.token);
  }

  const errorMessage = () => {
    return message.map((err) => (
      <FormHelperText error key={err}>
        {err}
      </FormHelperText>
    ));
  };

  const emailErrors = () => {
    if (errors) {
      if (errors.email) {
        return true;
      } else if (errors.graphQL) {
        return true;
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete='off'
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: 'auto',
        paddingTop: '20px',
      }}>
      <TextField
        error={errors && errors.firstName}
        id='standard-basic'
        label='first name'
        name='firstName'
        value={formState.firstName}
        onChange={(e) => handleChange(e)}
      />
      <TextField
        error={errors && errors.lastName}
        id='standard-basic'
        label='last name'
        name='lastName'
        value={formState.lastName}
        onChange={(e) => handleChange(e)}
      />
      <TextField
        error={emailErrors()}
        id='standard-basic'
        label='email'
        name='email'
        value={formState.email}
        onChange={(e) => handleChange(e)}
      />
      <TextField
        error={errors && errors.password}
        id='standard-basic'
        label='password'
        name='password'
        type='password'
        value={formState.password}
        onChange={(e) => handleChange(e)}
      />
      <TextField
        error={errors && errors.confirmPassword}
        id='standard-basic'
        label='confirm password'
        name='confirmPassword'
        type='password'
        value={formState.confirmPassword}
        onChange={(e) => handleChange(e)}
      />
      {errorMessage()}
      <Button color='primary' type='submit' style={{ marginTop: '20px' }}>
        Sign Up
      </Button>
    </form>
  );
}
