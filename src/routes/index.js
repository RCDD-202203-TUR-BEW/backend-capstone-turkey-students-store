const router = require('express').Router();

const usersRoutes = require('./users');
const authRoutes = require('./auth');
const productsRoutes = require('./products');
const profileRoutes = require('./profile');

router.use('/profile', profileRoutes);
router.use('/products', productsRoutes);
router.use('/users', usersRoutes);
router.use('/auth', authRoutes);

module.exports = router;
