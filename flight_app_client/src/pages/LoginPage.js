import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function LoginPage() {
  const [signUp, setSignUp] = useState(true);

  return (
    <>
      {signUp && (
        <form
          noValidate
          autoComplete='off'
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            margin: 'auto',
          }}>
          <TextField id='standard-basic' label='first name' />
          <TextField id='standard-basic' label='last name' />
          <TextField id='standard-basic' label='email' />
          <TextField id='standard-basic' label='password' />
          <TextField id='standard-basic' label='confirm password' />
          <Button color='primary'>Sign Up!</Button>
        </form>
      )}
    </>
  );
}
