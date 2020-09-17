// --Login Validation--
// email is not empty
// password is not empty

const { UserInputError } = require('apollo-server');

//--Sign up Validation--
// firstName is not empty
// lastName is not empty
// email is not empty
// email is valid email
// password is not empty
// confirmPassword is not empty
// passwords match

const loginValidation = (str) => {
  const errors = {};

  return {
    errors,
    valid: errors.length < 1 ? true : false,
  };
};

console.log(loginValidation(''));
