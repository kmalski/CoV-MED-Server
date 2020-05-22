const mongoose = require('mongoose');
const User = require('../user.model');
const Schema = mongoose.Schema;

const visitSchema = new Schema({
  date: { type: Date, required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  clinic: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
});

const clientSchema = User.discriminator(
  'Client',
  new Schema({
    pesel: { type: String, required: true },
    active: { type: Boolean, default: true},
    visits: [visitSchema],
  })
);

module.exports = mongoose.model('Client');
