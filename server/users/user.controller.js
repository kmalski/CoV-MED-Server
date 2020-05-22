const express = require('express');
const router = express.Router();
const jwt = require('../_helpers/jwt');
const userService = require('./user.service');

router.get('/', jwt.authorize(['Receptionist']), getAll);
router.get('/:id', getById);
router.get('/current', getCurrent);

router.post('/authenticate', authenticate);

router.put('/:id', update);

router.delete('/delete', deleteByCredentials);

module.exports = router;

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((user) => (user ? res.json(user) : res.status(400).json({ message: 'Email or password is incorrect' })))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getCurrent(req, res, next) {
  userService
    .getById(req.user.sub)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function deleteByCredentials(req, res, next) {
  userService
    .deleteByCredentials(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}
