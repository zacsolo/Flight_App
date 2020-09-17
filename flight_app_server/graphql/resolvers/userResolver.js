const { UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  signUpValidation,
  loginValidation,
} = require('../../utils/userValidation');
const User = require('../../mongoose/userSchema');

module.exports = {
  Mutation: {
    //---- Signing Up a New User -----
    signup: async (root, args) => {
      const { firstName, lastName, email, password, confirmPassword } = args;
      const { errors, valid } = signUpValidation(
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

      const token = jwt.sign(userForToken, process.env.SECRET, {
        expiresIn: '1h',
      });
      return { ...savedUser._doc, id: savedUser._id, token };
    },
    //--- Login for Existing User ---
    login: async (root, args) => {
      const { email, password } = args;
      const { errors, valid } = loginValidation(email, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ email });
      console.log(user);

      if (!user) {
        throw new UserInputError('Account not found', {
          errors: { email: 'Account not found' },
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatch) {
        throw new AuthenticationError('Invalid Credentials', { errors });
      }

      const userForToken = {
        email: user.email,
        id: user._id,
      };

      const token = jwt.sign(userForToken, process.env.SECRET, {
        expiresIn: '1h',
      });
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        passwordHash: user.passwordHash,
        id: user._id,
        token,
      };
    },
  },
};
