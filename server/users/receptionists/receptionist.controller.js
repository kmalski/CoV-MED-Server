const express = require('express');
const router = express.Router();
const receptionistService = require('./receptionist.service');
const jwt = require('../../_helpers/jwt');

router.get('/visits', jwt.authorize(['Receptionist']), getVisits);

router.post('/register', register);

module.exports = router;

function register(req, res, next) {
  receptionistService
    .create(req.body)
    .then((user) => (user ? res.json(user) : res.status(400).json({ message: 'Could not register new user' })))
    .catch((err) => next(err));
}

function getVisits(req, res, next) {
  receptionistService
    .getVisits(req.query)
    .then((visits) => res.json(visits))
    .catch((err) => next(err));
}