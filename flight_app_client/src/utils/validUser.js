export const validateUserSignUp = (
  firstName,
  lastName,
  email,
  password,
  confirmPassword
) => {
  let errors = {};

  if (!firstName || firstName.trim() === '') {
    errors.firstName = 'cannot be empty';
  }
  if (!lastName || lastName.trim() === '') {
    errors.lastName = 'cannot be empty';
  }
  if (!email || email.trim() === '') {
    errors.email = 'cannot be empty';
  }
  const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
  if (!email.match(regEx)) {
    errors.email = 'must be a valid email address';
  }
  if (!password || password.trim() === '') {
    errors.password = 'cannot be empty';
  }
  if (!confirmPassword || confirmPassword.trim() === '') {
    errors.confirmPassword = 'cannot be empty';
  }

  if (password && confirmPassword) {
    if (password !== confirmPassword) {
      errors.password = 'passwords must match';
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length >= 1 ? false : true,
  };
};

export const validateUserLogin = (email, password) => {
  let errors = {};

  if (!email || email.trim() === '') {
    errors.email = 'cannot be empty';
  }
  const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
  if (!email.match(regEx)) {
    errors.email = 'must be a valid email address';
  }
  if (!password || password.trim() === '') {
    errors.password = 'cannot be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length >= 1 ? false : true,
  };
};
