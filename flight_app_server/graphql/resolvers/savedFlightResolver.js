const { UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findByIdAndUpdate } = require('../../mongoose/userSchema');

const User = require('../../mongoose/userSchema');
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
      const validateToken = (str) => {
        if (str && str.startsWith('bearer ')) {
          return str.substring(7);
        } else {
          return null;
        }
      };

      const token = validateToken(context.req.headers.authorization);
      const decodedToken = jwt.verify(token, process.env.SECRET);
      console.log(decodedToken);

      if (!(token && decodedToken.id)) {
        throw new AuthenticationError('BAD AUTH HEADER');
      }
      const foundUser = await User.findById(decodedToken.id);
      console.log('Found User', foundUser);

      const { firstName, lastName, email, passwordHash, createdAt } = foundUser;
      const updatedUser = {
        firstName,
        lastName,
        email,
        passwordHash,
        createdAt,
        savedFlights: [
          ...foundUser.savedFlights,
          { ...args, createdAt: new Date() },
        ],
      };

      console.log("NEW USER WE'RE ATTEMPTING TO PUSH", updatedUser);

      const savedUpdatedUser = await User.findByIdAndUpdate(
        decodedToken.id,
        updatedUser,
        { new: true }
      );
      console.log('UPDATED USER ACTUALLY SAVED ===', savedUpdatedUser);
      //Need to send request headers with every mutation
      //Get id off of token sent in context
      //find user by Id from token
      //then send updated user info with new flight info

      return {
        id: savedUpdatedUser._id,
        token,
        firstName: savedUpdatedUser.firstName,
        lastName: savedUpdatedUser.lastName,
        email: savedUpdatedUser.email,
        passwordHash: savedUpdatedUser.passwordHash,
        createdAt: savedUpdatedUser.createdAt,
        savedFlights: [...savedUpdatedUser.savedFlights],
      };
    },
  },
};
