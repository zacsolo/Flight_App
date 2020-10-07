const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  savedFlights: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

module.exports = User = mongoose.model('User', userSchema);
