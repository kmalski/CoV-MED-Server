const mongoose = require('mongoose');
const User = require('../user.model');
const Schema = mongoose.Schema;

const visitSchema = new Schema({
  date: { type: Date, required: true },
});

const clientSchema = User.discriminator(
  'Client',
  new Schema({
    pesel: { type: String, required: true },
    visits: [visitSchema],
  })
);

module.exports = mongoose.model('Client');
