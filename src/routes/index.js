const router = require('express').Router();

const profileRoutes = require('./profile');
const authRoutes = require('./auth');
const productsRoutes = require('./products');

const usersRoutes = require('./users');

router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
