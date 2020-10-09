import React, { useState, useEffect, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { validateUserSignUp } from '../utils/validUser';
import { SIGN_UP } from '../gql/UserMutations';
import { FormHelperText, Typography } from '@material-ui/core';
import { GlobalSearchStateContext } from '../utils/context';

export default function SignUpPage() {
  const {
    isLoggedIn,
    setIsLoggedIn,
    setFirstSearch,
    setLoginModalOpen,
  } = useContext(GlobalSearchStateContext);
  const [signup, { data }] = useMutation(SIGN_UP);
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState();
  const history = useHistory();
  useEffect(() => {
    if (data || isLoggedIn) {
      setFirstSearch(true);
      setIsLoggedIn(true);
      history.push('/user');
    }
  }, [data]);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  //
  //ERROR HANDLING FOR BOTH PAGES
  //Already created a haleper function in Utils
  //to help validate. Will be getting some info from the back end, would be ideal
  //to incorperate that into the helperText for each input

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formState;
    const { errors, valid } = validateUserSignUp(
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    );

    if (valid) {
      console.log({ firstName, lastName, email, password, confirmPassword });
      signup({
        variables: { firstName, lastName, email, password, confirmPassword },
      })
        .then(() => setLoginModalOpen(false))
        .catch((error) => setErrors({ ...errors, graphQL: error }));
    } else {
      setErrors(errors);
      console.log({ firstName, lastName, email, password, confirmPassword });
    }
  };
  if (data) {
    localStorage.setItem('userToken', data.signup.token);
  }

  return (
    <>
      {errors ? (
        <form
          onSubmit={handleSubmit}
          autoComplete='off'
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            margin: 'auto',
          }}>
          <TextField
            error={errors.firstName && true}
            helperText={errors.firstName && `${errors.firstName}`}
            id='standard-basic'
            label='first name'
            name='firstName'
            value={formState.firstName}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            error={errors.lastName && true}
            helperText={errors.lastName && `${errors.lastName}`}
            id='standard-basic'
            label='last name'
            name='lastName'
            value={formState.lastName}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            error={errors.email || errors.graphQL ? true : false}
            helperText={errors.email && `${errors.email}`}
            id='standard-basic'
            label='email'
            name='email'
            value={formState.email}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            error={errors.password && true}
            helperText={errors.password && `${errors.password}`}
            id='standard-basic'
            label='password'
            name='password'
            type='password'
            value={formState.password}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            error={errors.confirmPassword && true}
            helperText={errors.confirmPassword && `${errors.confirmPassword}`}
            id='standard-basic'
            label='confirm password'
            name='confirmPassword'
            type='password'
            value={formState.confirmPassword}
            onChange={(e) => handleChange(e)}
          />
          <FormHelperText error>
            {errors.graphQL ? 'Email already taken' : null}
          </FormHelperText>
          <Button color='primary' type='submit'>
            Sign Up
          </Button>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit}
          autoComplete='off'
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            margin: 'auto',
          }}>
          <TextField
            id='standard-basic'
            label='first name'
            name='firstName'
            value={formState.firstName}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            id='standard-basic'
            label='last name'
            name='lastName'
            value={formState.lastName}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            id='standard-basic'
            label='email'
            name='email'
            value={formState.email}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            id='standard-basic'
            label='password'
            name='password'
            type='password'
            value={formState.password}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            id='standard-basic'
            label='confirm password'
            name='confirmPassword'
            type='password'
            value={formState.confirmPassword}
            onChange={(e) => handleChange(e)}
          />
          <Button color='primary' type='submit'>
            Sign Up
          </Button>
        </form>
      )}
    </>
  );
}
