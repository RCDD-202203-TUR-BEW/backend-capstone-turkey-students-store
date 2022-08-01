const router = require('express').Router();

const usersRoutes = require('./users');
const usersAuth = require('./auth');

router.use('/users', usersRoutes);
router.use('/auth', usersAuth);

module.exports = router;
