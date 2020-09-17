// --Login Validation--
// email is not empty
// password is not empty

//--Sign up Validation--
// firstName is not empty
// lastName is not empty
// email is not empty
// email is valid email
// password is not empty
// confirmPassword is not empty
// passwords match

const loginValidation = (
  firstName,
  lastName,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (firstName.trim() === '') {
    errors.firstName = 'Can not be empty';
  }
  if (lastName.trim() === '') {
    errors.lastName = 'Can not be empty';
  }
  if (email.trim() === '') {
    errors.email = 'Can not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Must be a valid email address';
    }
  }
  if (password.trim() === '') {
    errors.password = 'Can not be empty';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'passwords must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1 ? true : false,
  };
};

module.exports = {
  loginValidation,
};
