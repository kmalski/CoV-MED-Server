const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const Client = db.Client;
const User = db.User;

module.exports = {
  create,
};

async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  const client = new Client(userParam);

  // hash password
  if (userParam.password) {
    client.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  await client.save();

  const registeredUser = await User.findOne({ username: userParam.username });

  return {
      username: registeredUser.username,
      userType: registeredUser.userType,
      firstName: registeredUser.firstName,
      lastName: registeredUser.lastName,
      token: registeredUser.token
    };

}
