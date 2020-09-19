const isEmpty = (str) => {
  if (str.toString().trim() === '') {
    return true;
  }
  return false;
};

//SEARCH QUOTE VALIDATION
//Check that airport codes are not empty
//Check that airport codes end in SKY
//Check that date is not empty
//Check that date is in valid format
//Check that date is a future date

const flightValidation = (
  startingAirport,
  endingAirport,
  outboundDate,
  inboundDate
) => {
  const errors = {};

  if (isEmpty(startingAirport)) {
    errors.startingAirport = 'Can not be empty';
  } else if (startingAirport.split('-')[1] !== 'sky') {
    errors.startingAirport = 'Improper format, must end in sky';
  }

  if (isEmpty(endingAirport)) {
    errors.endingAirport = 'Can not be empty';
  } else if (endingAirport.split('-')[1] !== 'sky') {
    errors.endingAirport = 'Improper format, must end in sky';
  }

  if (isEmpty(outboundDate)) {
    errors.outboundDate = 'Can not be empty';
  }

  //CHECKING DATE FORMAT------------------------
  //__No dashes
  else if (outboundDate.split('-').length === 1) {
    errors.outboundDate = 'Improper format, no dashes';
  }
  //__Two digit length for months
  else if (outboundDate.split('-').length === 2) {
    if (
      outboundDate.split('-')[1].length !== 2 ||
      outboundDate.split('-')[0].length !== 4
    ) {
      errors.outboundDate =
        'Improper format, two digit length for months, four digit for years';
    }
  }
  //__Search query includes "day"__
  else if (outboundDate.split('-').length === 3) {
    //__Both month and day are two digits, year is 4
    if (
      outboundDate.split('-')[0].length !== 4 ||
      outboundDate.split('-')[1].length !== 2 ||
      outboundDate.split('-')[2].length !== 2
    ) {
      errors.outboundDate =
        'Improper format, both month and day have to be two digits, year must be four';
    }
  }
  //__Beyond 3 dashes
  else if (outboundDate.split('-').length > 3) {
    errors.outboundDate = 'Improper format, string too long';
  }

  //__INBOUND DATE IS OPTIONAL,
  //__THESE ONLY GET VALIDATED IF IT IS NOT LEFT EMPTY
  if (inboundDate) {
    //__No dashes__
    if (inboundDate.split('-').length === 1) {
      errors.inboundDate = 'Improper format, no dashes';
    }
    //__Two digit length for months__
    else if (inboundDate.split('-').length === 2) {
      if (
        inboundDate.split('-')[1].length !== 2 ||
        inboundDate.split('-')[0].length !== 4
      ) {
        errors.inboundDate =
          'Improper format, two digit length for months, four digit for years';
      }
    }
    //__Search query includes "day"__
    else if (inboundDate.split('-').length === 3) {
      //__Both month and day are two digits, year is 4__
      if (
        inboundDate.split('-')[0].length !== 4 ||
        inboundDate.split('-')[1].length !== 2 ||
        inboundDate.split('-')[2].length !== 2
      ) {
        errors.inboundDate =
          'Improper format, both month and day have to be two digits, year must be four';
      }
    }
    //__Beyond 3 dashes__
    else if (inboundDate.split('-').length > 3) {
      errors.inboundDate = 'Improper format, string too long';
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1 ? true : false,
  };
};

const flightToAnywhereValidation = (
  startingAirport,
  searchDate,
  amountOfResults
) => {
  const errors = {};

  if (isEmpty(startingAirport)) {
    errors.startingAirport = 'Can not be empty';
  } else if (startingAirport.split('-')[1] !== 'sky') {
    errors.startingAirport = 'Improper format';
  }

  if (isEmpty(searchDate)) {
    errors.searchDate = 'Can not be empty';
  }

  //CHECKING DATE FORMAT------------------------
  //__No dashes
  else if (
    searchDate.split('-').length === 1 &&
    searchDate.toLowerCase() !== 'anytime'
  ) {
    errors.searchDate = 'Improper format, no dashes';
  }
  //__Two digit length for months
  else if (searchDate.split('-').length === 2) {
    if (
      searchDate.split('-')[1].length !== 2 ||
      searchDate.split('-')[0].length !== 4
    ) {
      errors.searchDate =
        'Improper format, two digit length for months, four digit for years';
    } else if (
      !Number(searchDate.split('-')[1]) ||
      !Number(searchDate.split('-')[0])
    ) {
      errors.searchDate = 'Improper format, numbers only';
    }
  }
  //__Search query includes "day"__
  else if (searchDate.split('-').length === 3) {
    //__Both month and day are two digits, year is 4
    if (
      searchDate.split('-')[0].length !== 4 ||
      searchDate.split('-')[1].length !== 2 ||
      searchDate.split('-')[2].length !== 2
    ) {
      errors.searchDate =
        'Improper format, both month and day have to be two digits, year must be four';
    } else if (
      !Number(searchDate.split('-')[0]) ||
      !Number(searchDate.split('-')[1]) ||
      !Number(searchDate.split('-')[2])
    ) {
      errors.searchDate = 'Improper format, numbers only';
    }
  }
  //__Beyond 3 dashes
  else if (searchDate.split('-').length > 3) {
    errors.searchDate = 'Improper format, string too long';
  }

  if (!Number(amountOfResults) || amountOfResults.length <= 1) {
    errors.amountOfResults = 'Not a valid number of search results';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1 ? true : false,
  };
};

//--Sign up Validation--
// firstName is not empty
// lastName is not empty
// email is not empty
// email is valid email
// password is not empty
// passwords match

// const signUpValidation = (
//   firstName,
//   lastName,
//   email,
//   password,
//   confirmPassword
// ) => {
//   const errors = {};

//   if (firstName.trim() === '') {
//     errors.firstName = 'Can not be empty';
//   }
//   if (lastName.trim() === '') {
//     errors.lastName = 'Can not be empty';
//   }
//   if (email.trim() === '') {
//     errors.email = 'Can not be empty';
//   } else {
//     const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
//     if (!email.match(regEx)) {
//       errors.email = 'Must be a valid email address';
//     }
//   }
//   if (password.trim() === '') {
//     errors.password = 'Can not be empty';
//   } else if (password !== confirmPassword) {
//     errors.confirmPassword = 'passwords must match';
//   }

//   return {
//     errors,
//     valid: Object.keys(errors).length < 1 ? true : false,
//   };
// };

module.exports = {
  flightValidation,
  flightToAnywhereValidation,
};
