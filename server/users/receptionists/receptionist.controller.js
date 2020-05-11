const express = require('express');
const router = express.Router();
const receptionistService = require('./receptionist.service');

router.post('/register', register);

module.exports = router;

function register(req, res, next) {
  receptionistService
    .create(req.body)
    .then((user) => (user ? res.json(user) : res.status(400).json({ message: 'Could not register new user' })))
    .catch((err) => next(err));
}
