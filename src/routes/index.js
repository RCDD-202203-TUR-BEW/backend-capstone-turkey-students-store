const router = require('express').Router();

const usersRoutes = require('./profile');

router.use('/profile', usersRoutes);

module.exports = router;
