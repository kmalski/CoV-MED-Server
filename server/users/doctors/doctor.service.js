const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const Doctor = db.Doctor;
const User = db.User;

module.exports = {
  create,
};

async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  const doctor = new Doctor(userParam);

  // hash password
  if (userParam.password) {
    doctor.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  await doctor.save();
}
