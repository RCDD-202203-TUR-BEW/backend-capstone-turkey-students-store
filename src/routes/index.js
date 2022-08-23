const router = require('express').Router();

const usersRoutes = require('./users');
const productsRoutes = require('./products');
const authRoutes = require('./auth');
const profileRoutes = require('./profile');

router.use('/profile', profileRoutes);
router.use('/products', productsRoutes);
router.use('/users', usersRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
