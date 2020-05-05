const express = require('express');
const router = express.Router();
const clientService = require('./client.service');

router.post('/register', register);

module.exports = router;

function register(req, res, next) {
  clientService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}
