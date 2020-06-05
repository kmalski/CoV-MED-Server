const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../_helpers/db');
const { UnauthorizedError } = require('../_helpers/errors');
const secret = process.env.JWT_KEY;

module.exports = {
  authenticate,
  getAll,
  getById,
  update,
  deleteByCredentials,
};

async function authenticate({ email, password }) {
  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.hash)) {
    const { hash, userType, email, firstName, lastName } = user.toObject();
    const token = jwt.sign({ sub: user.id, email: email, userType: userType }, secret);
    return {
      email,
      firstName,
      lastName,
      userType,
      token,
    };
  }
}

async function getAll() {
  return await User.find().select('-hash');
}

async function getById(id) {
  return await User.findById(id).select('-hash');
}

async function update(id, userParam) {
  const user = await User.findById(id);

  // validate
  if (!user) throw 'User not found';
  if (user.email !== userParam.email && (await User.findOne({ email: userParam.email }))) {
    throw 'email "' + userParam.email + '" is already taken';
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
}

async function deleteByCredentials(userParam) {
  const user = await User.findOne({ email: userParam.email });

  if (!user) {
    throw 'User "' + userParam.email + '" does not exist';
  }

  if (user && bcrypt.compareSync(userParam.password, user.hash)) {
    const { hash, userType, email } = user.toObject();
    await User.findByIdAndRemove(user.id);
  } else {
    throw new UnauthorizedError('Invalid password');
  }
}
