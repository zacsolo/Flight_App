import React, { useContext, useState } from 'react';
import { SIGN_UP } from '../gql/UserMutations';
import { useMutation } from '@apollo/client';
import { validateUserSignUp } from './validUser';

import { GlobalSearchStateContext } from './context';

export default function ControlUserSubmit(formState) {
  const { setLoginModalOpen } = useContext(GlobalSearchStateContext);
  const [errors, setErrors] = useState();
  const [message, setMessage] = useState([]);
  const [signup, { data }] = useMutation(SIGN_UP);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formState;
    const { errors, valid, message } = validateUserSignUp(
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    );

    if (valid) {
      signup({
        variables: {
          firstName,
          lastName,
          email: email.toLowerCase(),
          password,
          confirmPassword,
        },
      })
        .then(() => {
          setLoginModalOpen(false);
        })
        .catch((error) => {
          setMessage([...message, error.message]);
          setErrors({ ...errors, graphQL: error });
        });
    } else {
      setErrors(errors);
      setMessage(message);
    }
  };
  if (data) {
    localStorage.setItem('userToken', data.signup.token);
  }

  return {
    handleSubmit,
    data,
    errors,
    message,
  };
}
