const express = require('express');
const router = express.Router();
const receptionistService = require('./receptionist.service');
const jwt = require('../../_helpers/jwt');

router.get('/visits', jwt.authorize(['Receptionist']), getVisits);

router.post('/register', register);

router.put('/postpone-visit', jwt.authorize(['Receptionist']), postponeVisit);
router.put('/activate/:email', jwt.authorize(['Receptionist']), activate);
router.put('/deactivate/:email', jwt.authorize(['Receptionist']), deactivate);

router.delete('/cancel-visit', jwt.authorize(['Receptionist']), cancelVisit);

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

function postponeVisit(req, res, next) {
  receptionistService
    .postponeVisit(req.body)
    .then(() => res.json())
    .catch((err) => next(err));
}

function activate(req, res, next) {
  receptionistService
    .activate(req.params.email)
    .then(() => res.json())
    .catch((err) => next(err));
}

function deactivate(req, res, next) {
  receptionistService
    .deactivate(req.params.email)
    .then(() => res.json())
    .catch((err) => next(err));
}

function cancelVisit(req, res, next) {
  receptionistService
    .cancelVisit(req.body)
    .then(() => res.json())
    .catch((err) => next(err));
}
