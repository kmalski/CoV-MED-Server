const express = require('express');
const router = express.Router();
const jwt = require('../../_helpers/jwt');
const clientService = require('./client.service');

router.post('/register', register);
router.post('/make-visit', jwt.authorize(['Client']), makeVisit);

router.get('/', jwt.authorize(['Receptionist']), getAll);
router.get('/visits', jwt.authorize(['Client']), getVisits);
router.get('/examinations', jwt.authorize(['Client']), getExaminations);
router.get('/status', jwt.authorize(['Client']), getStatus);

module.exports = router;

function register(req, res, next) {
  clientService
    .create(req.body)
    .then((user) => (user ? res.json(user) : res.status(400).json({ message: 'Could not register new user' })))
    .catch((err) => next(err));
}

function makeVisit(req, res, next) {
  clientService
    .makeVisit(req.body, req.user.sub)
    .then(() => res.json())
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  clientService
    .getAll()
    .then((clients) => res.json(clients))
    .catch((err) => next(err));
}

function getVisits(req, res, next) {
  clientService
    .getVisits(req.query, req.user.sub)
    .then((visits) => res.json(visits))
    .catch((err) => next(err));
}

function getExaminations(req, res, next) {
  clientService
    .getExaminations(req.user.sub)
    .then((examinations) => res.json(examinations))
    .catch((err) => next(err));
}

function getStatus(req, res, next) {
  clientService
    .getStatus(req.user.sub)
    .then((status) => res.json(status))
    .catch((err) => next(err));
}
