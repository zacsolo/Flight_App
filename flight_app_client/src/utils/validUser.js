export const validateUserSignUp = (
  firstName,
  lastName,
  email,
  password,
  confirmPassword
) => {
  let errors = {};
  let message = {};

  if (!firstName || firstName.trim() === '') {
    message.firstName = 'cannot be empty';
    errors.firstName = true;
  }
  if (!lastName || lastName.trim() === '') {
    message.lastName = 'cannot be empty';
    errors.lastName = true;
  }
  const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
  if (!email.match(regEx)) {
    message.email = 'must be a valid email address';
    errors.email = true;
  }
  if (!email || email.trim() === '') {
    message.email = 'cannot be empty';
    errors.email = true;
  }
  if (!password || password.trim() === '') {
    message.password = 'cannot be empty';
    errors.password = true;
  }
  if (!confirmPassword || confirmPassword.trim() === '') {
    message.confirmPassword = 'cannot be empty';
    errors.confirmPassword = true;
  }

  if (password && confirmPassword) {
    if (password !== confirmPassword) {
      message.password = 'passwords must match';
      errors.password = true;
      errors.confirmPassword = true;
    }
  }

  message = [...new Set(Object.values(message))];

  return {
    message,
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
