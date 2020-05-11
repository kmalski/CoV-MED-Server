const express = require('express');
const router = express.Router();
const doctorService = require('./doctor.service');

router.post('/register', register);

module.exports = router;

function register(req, res, next) {
  doctorService
    .create(req.body)
    .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
    .catch((err) => next(err));
}
