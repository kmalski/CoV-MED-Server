const express = require('express');
const router = express.Router();
const doctorService = require('./doctor.service');

router.post('/register', register);

module.exports = router;

function register(req, res, next) {
  doctorService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}
