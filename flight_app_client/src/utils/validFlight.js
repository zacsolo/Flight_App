import moment from 'moment';

export const validateFlight = (
  adventureMode,
  { startingAirport, endingAirport, outboundDate, inboundDate, oneWay }
) => {
  let errors = {};

  if (!startingAirport || startingAirport.trim() === '') {
    errors.startingAirport = true;
  }

  if (!adventureMode) {
    if (!endingAirport || endingAirport.trim() === '') {
      errors.endingAirport = true;
    }
  }

  if (!outboundDate || outboundDate.trim() === '') {
    errors.outboundDate = true;
  }
  if (!inboundDate || inboundDate.trim() === '') {
    if (!oneWay) {
      errors.inboundDate = true;
    }
  }
  if (inboundDate.length > 1 && outboundDate.length > 1) {
    if (moment(outboundDate).isAfter(inboundDate)) {
      errors.outboundDate = true;
      errors.inboundDate = true;
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length >= 1 ? false : true,
  };
};
