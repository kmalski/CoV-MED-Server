const express = require('express');
const router = express.Router();
const clientService = require('./client.service');

router.post('/register', register);

module.exports = router;

function register(req, res, next) {
  clientService
    .create(req.body)
    .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
    .catch((err) => next(err));
}
