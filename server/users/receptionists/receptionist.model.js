const mongoose = require('mongoose');
const User = require('../user.model');
const Schema = mongoose.Schema;

const receptionistSchema = User.discriminator('Receptionist', new Schema({}));

module.exports = mongoose.model('Receptionist');
