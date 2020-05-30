const express = require('express');
const router = express.Router();
const doctorService = require('./doctor.service');

router.get('/', getAll);
router.get('/visits', getVisits);

router.post('/register', register);

module.exports = router;

function register(req, res, next) {
  doctorService
    .create(req.body)
    .then((user) => (user ? res.json(user) : res.status(400).json({ message: 'Could not register new user' })))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  doctorService
    .getAll()
    .then((doctors) => res.json(doctors))
    .catch((err) => next(err));
}

function getVisits(req, res, next) {
  doctorService
    .getVisits(req.query, req.user.sub)
    .then((visits) => res.json(visits))
    .catch((err) => next(err));
}