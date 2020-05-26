const expressJwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const userService = require('../users/user.service');
const secret = process.env.JWT_KEY

module.exports = {
  authenticate,
  authorize,
};

function authenticate() {
  return expressJwt({ secret }).unless({
    // public routes that don't require authentication
    path: [
      '/users/authenticate',
      '/clients/register',
      '/doctors/register',
      '/receptionists/register',
      '/doctors'
    ],
  });
}

function authorize(userTypes) {
  return jwtAuthz(userTypes, {customScopeKey: 'userType'})
}