const express = require('express');
const router = express.Router();
const doctorService = require('./doctor.service');
const jwt = require('../../_helpers/jwt');

router.get('/', getAll);
router.get('/visits', jwt.authorize(['Doctor']), getVisits);
router.get('/clients', jwt.authorize(['Doctor']), getClients);

router.post('/register', register);
router.post('/add-examination', jwt.authorize(['Doctor']), addExamination);
router.post('/add-refferal', jwt.authorize(['Doctor']), addRefferal);
router.post('/add-prescription', jwt.authorize(['Doctor']), addPrescription);

module.exports = router;

function register(req, res, next) {
  doctorService
    .create(req.body)
    .then((user) => (user ? res.json(user) : res.status(400).json({ message: 'Could not register new user' })))
    .catch((err) => next(err));
}

function addExamination(req, res, next) {
  doctorService
    .addExamination(req.body, req.user.sub)
    .then(() => res.json())
    .catch((err) => next(err));
}

function addRefferal(req, res, next) {
  doctorService
    .addRefferal(req.body, req.user.sub)
    .then(() => res.json())
    .catch((err) => next(err));
}

function addPrescription(req, res, next) {
  doctorService
    .addPrescription(req.body, req.user.sub)
    .then(() => res.json())
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

function getClients(req, res, next) {
  doctorService
    .getClients(req.user.sub)
    .then((visits) => res.json(visits))
    .catch((err) => next(err));
}
