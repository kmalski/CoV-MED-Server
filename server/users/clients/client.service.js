const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const Client = db.Client;
const User = db.User;

module.exports = {
  create,
};

async function create(userParam) {
  if (await User.findOne({ email: userParam.email })) {
    throw 'User with email ' + userParam.email + ' already exists';
  }

  const client = new Client(userParam);

  if (userParam.password) {
    client.hash = bcrypt.hashSync(userParam.password, 10);
  }

  await client.save();

  return await User.findOne({ email: userParam.email }).select('-hash');
}
