const { UserInputError, AuthenticationError } = require('apollo-server');

const jwt = require('jsonwebtoken');

const User = require('../../mongoose/userSchema');

module.exports = {
  Mutation: {
    saveUserFlight: async (root, args, context) => {
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
    removeUserFlight: async (root, args, context) => {
      const { departureDate, outboundOrigin, outboundDestination } = args;

      const validateToken = (str) => {
        if (str && str.startsWith('bearer ')) {
          return str.substring(7);
        } else {
          return null;
        }
      };
      const token = validateToken(context.req.headers.authorization);

      const decodedToken = jwt.verify(token, process.env.SECRET);

      if (!(token && decodedToken.id)) {
        throw new AuthenticationError('BAD AUTH HEADER');
      }

      const foundUser = await User.findById(decodedToken.id);

      const updatedFlightArr = foundUser.savedFlights.filter(
        (flight) =>
          flight.departureDate !== departureDate ||
          outboundDestination !== flight.outboundDestination ||
          outboundOrigin !== flight.outboundOrigin
      );

      console.log('UPDATED FLIGHT ARR', updatedFlightArr);

      const { firstName, lastName, email, passwordHash, createdAt } = foundUser;

      const updatedUser = {
        firstName,
        lastName,
        email,
        passwordHash,
        createdAt,
        savedFlights: updatedFlightArr,
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
