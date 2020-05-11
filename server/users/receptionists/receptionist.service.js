const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const Receptionist = db.Receptionist;
const User = db.User;

module.exports = {
  create,
};

async function create(userParam) {
  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  const receptionist = new Receptionist(userParam);

  if (userParam.password) {
    receptionist.hash = bcrypt.hashSync(userParam.password, 10);
  }

  await receptionist.save();

  return await User.findOne({ username: userParam.username }).select('-hash');
}
