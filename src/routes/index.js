const router = require('express').Router();

const usersRoutes = require('./users');
const authRoutes = require('./auth');

router.use('/profile', usersRoutes);

router.use('/users', usersRoutes);
router.use('/auth', authRoutes);

module.exports = router;
