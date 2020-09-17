const { UserInputError } = require('apollo-server');
const { loginValidation } = require('../../utils/loginValidation');
const User = require('../../mongoose/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    test: () => 'test resolver',
  },
  Mutation: {
    signup: async (root, args) => {
      const { firstName, lastName, email, password, confirmPassword } = args;
      const { errors, valid } = loginValidation(
        firstName,
        lastName,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const userExists = await User.findOne({ email });

      if (userExists) {
        throw new UserInputError('Email already registered', {
          errors: { email: 'Email already registered' },
        });
      }

      const saltedRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltedRounds);

      const newUser = new User({
        firstName,
        lastName,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
      });

      const savedUser = await newUser.save();

      const userForToken = {
        email: savedUser.email,
        id: savedUser._id,
      };
      console.log(process.env.SECRET);
      const token = jwt.sign(userForToken, process.env.SECRET);
      return { ...savedUser._doc, id: savedUser._id, token };
    },
  },
};
module.exports = resolvers;
