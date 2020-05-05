const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
  User: require('../users/user.model'),
  Client: require('../users/clients/client.model'),
  Doctor: require('../users/doctors/doctor.model'),
  Receptionist: require('../users/receptionists/receptionist.model'),
};
