﻿const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const User = db.User;
const secret = process.env.JWT_KEY;

module.exports = {
  authenticate,
  getAll,
  getById,
  update,
  delete: _delete,
};

async function authenticate({ username, password }) {
  const user = await User.findOne({ username });
  if (user && bcrypt.compareSync(password, user.hash)) {
    const { hash, userType, username } = user.toObject();
    const token = jwt.sign({ sub: user.id, username: username, userType: userType }, secret);
    return {
      username,
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
  if (user.username !== userParam.username && (await User.findOne({ username: userParam.username }))) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}
