import moment from 'moment';

export const validateFlightAnywhere = (starting, outbound, inbound, oneWay) => {
  let errors = {};

  if (!starting || starting.trim() === '') {
    errors.starting = true;
  }
  if (!outbound || outbound.trim() === '') {
    errors.outbound = true;
  }
  if (!inbound || inbound.trim() === '') {
    if (!oneWay) {
      errors.inbound = true;
    }
  }
  if (inbound.length > 1 && outbound.length > 1) {
    if (moment(outbound).isAfter(inbound)) {
      errors.outbound = true;
      errors.inbound = true;
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length >= 1 ? false : true,
  };
};

export const validateFlightWithDest = (
  starting,
  ending,
  outbound,
  inbound,
  oneWay
) => {
  let errors = {};

  if (!starting || starting.trim() === '') {
    errors.starting = true;
  }
  if (!ending || ending.trim() === '') {
    errors.ending = true;
  }
  if (!outbound || outbound.trim() === '') {
    errors.outbound = true;
  }
  if (!inbound || inbound.trim() === '') {
    errors.inbound = true;
  }

  return {
    errors,
    valid: Object.keys(errors).length >= 1 ? false : true,
  };
};
