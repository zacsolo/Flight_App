const { UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Flight = require('../../mongoose/flightSchema');
const exampleFlight = {
  price: 92,
  direct: true,
  departureDate: '2020-10-25T00:00:00',
  outboundCarrierName: 'jetBlue',
  id: '11976a8f-7cfc-4c5a-906c-da763fb0c5c4',
  cityName: 'Dallas',
  returnDate: '2020-10-25T00:00:00',
  inboundCarrierName: 'jetBlue',
  outboundOrigin: 'New York John F. Kennedy, JFK',
  outboundDestination: 'Dallas Fort Worth International, DFW',
  inboundOrigin: 'Dallas Fort Worth International, DFW',
  inboundDestination: 'New York John F. Kennedy, JFK',
};
module.exports = {
  Mutation: {
    saveFlight: async (root, args, context) => {
      const newFlight = new Flight({
        ...args,
        createdAt: new Date().toISOString(),
      });
      const savedFlight = newFlight.save();
      return savedFlight;
    },
  },
};
