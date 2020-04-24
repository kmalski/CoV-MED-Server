const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
  User: require('../users/user.model'),
};
