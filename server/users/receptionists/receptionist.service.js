const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const Receptionist = db.Receptionist;
const User = db.User;

module.exports = {
  create,
};

async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  const receptionist = new Receptionist(userParam);

  // hash password
  if (userParam.password) {
    receptionist.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  await receptionist.save();

  const registeredUser = await User.findOne({ username: userParam.username });

  return {
      username: registeredUser.username,
      userType: registeredUser.userType,
      firstName: registeredUser.firstName,
      lastName: registeredUser.lastName,
      token: registeredUser.token
    };

}
