const express = require('express');
const router = express.Router();
const jwt = require('../../_helpers/jwt');
const clientService = require('./client.service');

router.post('/register', register);

router.put('/activate/:email', jwt.authorize(['Receptionist']), activate);
router.put('/deactivate/:email', jwt.authorize(['Receptionist']), deactivate);

module.exports = router;

function register(req, res, next) {
  clientService
    .create(req.body)
    .then((user) => (user ? res.json(user) : res.status(400).json({ message: 'Could not register new user' })))
    .catch((err) => next(err));
}

function activate(req, res, next) {
  clientService
    .activate(req.params.email)
    .then(() => res.json())
    .catch((err) => next(err));
}

function deactivate(req, res, next) {
  clientService
    .deactivate(req.params.email)
    .then(() => res.json())
    .catch((err) => next(err));
}
