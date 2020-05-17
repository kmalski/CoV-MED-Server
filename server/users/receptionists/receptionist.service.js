const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const Receptionist = db.Receptionist;
const User = db.User;

module.exports = {
  create,
};

async function create(userParam) {
  if (await User.findOne({ email: userParam.email })) {
    throw 'User with email ' + userParam.email + ' already exists';
  }

  const receptionist = new Receptionist(userParam);

  if (userParam.password) {
    receptionist.hash = bcrypt.hashSync(userParam.password, 10);
  }

  await receptionist.save();

  return await User.findOne({ email: userParam.email }).select('-hash');
}
