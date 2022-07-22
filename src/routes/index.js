const router = require('express').Router();

const usersRoutes = require('./users');

router.use('/users', usersRoutes);

module.exports = router;
