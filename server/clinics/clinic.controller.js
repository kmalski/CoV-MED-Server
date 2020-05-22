const express = require('express');
const router = express.Router();
const jwt = require('../_helpers/jwt');
const clinicService = require('./clinic.service');

router.get('/', getAll);
router.get('/cities', getCities);
router.get('/city/streets', getStreets);
router.get('/city/street/services', getServices);
router.get('/city/street/service/doctors', getDoctors);
router.get('/:id', getById);

router.post('/', jwt.authorize(['Receptionist']), create);
router.post('/city/street/service', jwt.authorize(['Receptionist']), addService);
router.post('/city/street/service/doctor', jwt.authorize(['Receptionist']), addDoctor);

router.delete('/city/street', jwt.authorize(['Receptionist']), deleteByCityStreet)

module.exports = router;

function getAll(req, res, next) {
  clinicService
    .getAll()
    .then((clinics) => res.json(clinics))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  clinicService
    .getById(req.params.id)
    .then((clinic) => res.json(clinic))
    .catch((err) => next(err));
}

function getCities(req, res, next) {
  clinicService
    .getCities()
    .then((cities) => res.json(cities))
    .catch((err) => next(err));
}

function getStreets(req, res, next) {
  clinicService
    .getStreets(req.body.city)
    .then((streets) => res.json(streets))
    .catch((err) => next(err));
}

function getServices(req, res, next) {
  clinicService
    .getServices(req.body)
    .then((services) => res.json(services))
    .catch((err) => next(err));
}

function getDoctors(req, res, next) {
  clinicService
    .getDoctors(req.body)
    .then((doctors) => res.json(doctors))
    .catch((err) => next(err));
}

function create(req, res, next) {
  clinicService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function addService(req, res, next) {
  clinicService
    .addService(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function addDoctor(req, res, next) {
  clinicService
    .addDoctor(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function deleteByCityStreet(req, res, next) {
  clinicService
    .deleteByCityStreet(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}