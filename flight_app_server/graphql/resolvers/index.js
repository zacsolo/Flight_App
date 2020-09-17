const { UserInputError } = require('apollo-server');
const loginValidation = require('../../utils/loginValidation');
const User = require('../../mongoose/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    test: () => 'test resolver',
  },
  Mutation: {
    signup: async (root, args) => {
      if (args.confirmPassword !== args.password) {
        throw new UserInputError('Passwords do not match');
      }
      const saltedRounds = 10;
      const passwordHash = await bcrypt.hash(args.password, saltedRounds);

      const newUser = new User({
        ...args,
        passwordHash,
        createdAt: new Date().toISOString(),
      });

      const savedUser = await newUser.save();

      const userForToken = {
        email: savedUser.email,
        id: savedUser._id,
      };

      const token = jwt.sign(userForToken, 'SPIDERMAN-SECRET');
      return { ...savedUser._doc, id: savedUser._id, token };
    },
  },
};
module.exports = resolvers;
