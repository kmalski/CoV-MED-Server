const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const Client = db.Client;
const User = db.User;

module.exports = {
  create,
};

async function create(userParam) {
  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  const client = new Client(userParam);

  if (userParam.password) {
    client.hash = bcrypt.hashSync(userParam.password, 10);
  }

  await client.save();

  return await User.findOne({ username: userParam.username }).select('-hash');
}
