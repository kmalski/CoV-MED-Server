const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const Doctor = db.Doctor;
const User = db.User;

module.exports = {
  create,
};

async function create(userParam) {
  if (await User.findOne({ email: userParam.email })) {
    throw 'User with email ' + userParam.email + ' already exists';
  }

  const doctor = new Doctor(userParam);

  if (userParam.password) {
    doctor.hash = bcrypt.hashSync(userParam.password, 10);
  }

  await doctor.save();

  return await User.findOne({ email: userParam.email }).select('-hash');
}
