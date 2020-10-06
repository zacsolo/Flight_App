import React, { useState, useEffect, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { validateUserLogin } from '../utils/validUser';
import { LOGIN_USER } from '../gql/UserMutations';
import CheckIcon from '@material-ui/icons/Check';
import { GlobalSearchStateContext } from '../utils/context';

export default function LoginPage() {
  const history = useHistory();
  const [login, { data, loading, error }] = useMutation(LOGIN_USER);
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState();
  const { isLoggedIn, setIsLoggedIn, setFirstSearch } = useContext(
    GlobalSearchStateContext
  );

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formState;
    const { errors, valid } = validateUserLogin(email, password);
    if (valid) {
      login({ variables: { email, password } }).catch((err) => {
        setErrors({ ...errors, graphQL: err.graphQLErrors[0] });
      });
    } else {
      setErrors(errors);
    }
  };

  if (data) {
    console.log(data);
    localStorage.setItem('userToken', data.login.token);
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
            width: '300px',
            margin: 'auto',
            paddingTop: '80px',
          }}>
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
            error={errors.password || errors.graphQL ? true : false}
            helperText={
              errors.password
                ? `${errors.password}`
                : errors.graphQL
                ? 'Incorrect username or password.'
                : null
            }
            id='standard-basic'
            label='password'
            name='password'
            type='password'
            value={formState.password}
            onChange={(e) => handleChange(e)}
          />

          <Button color='primary' type='submit'>
            Login
          </Button>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit}
          autoComplete='off'
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            margin: 'auto',
            paddingTop: '80px',
          }}>
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
            value={formState.password}
            type='password'
            onChange={(e) => handleChange(e)}
          />
          <Button color='primary' type='submit'>
            Login
          </Button>
        </form>
      )}
    </>
  );
}
