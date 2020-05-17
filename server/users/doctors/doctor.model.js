const mongoose = require('mongoose');
const User = require('../user.model');
const Schema = mongoose.Schema;

const clientSchema = User.discriminator(
  'Doctor',
  new Schema({
    specialization: { type: String, required: true },
  })
);

module.exports = mongoose.model('Doctor');
