const express = require('express');
const router = express.Router();
const receptionistService = require('./receptionist.service');

router.post('/register', register);

module.exports = router;

function register(req, res, next) {
  receptionistService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}
