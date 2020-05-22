const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const Client = db.Client;
const User = db.User;

module.exports = {
  create,
  activate,
  deactivate,
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

async function activate(email) {
  const client = await Client.findOne({ email: email });

  if (!client) throw 'User not found';

  client.active = true;
  client.save();
}

async function deactivate(email) {
  const client = await Client.findOne({ email: email });

  if (!client) throw 'User not found';

  client.active = false;
  client.save();
}
