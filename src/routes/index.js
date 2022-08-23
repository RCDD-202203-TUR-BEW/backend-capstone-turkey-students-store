const router = require('express').Router();

const usersRoutes = require('./users');
const authRoutes = require('./auth');
const productsRoutes = require('./products');
const profileRoutes = require('./profile');
const donationRoutes = require('./donations');

router.use('/profile', profileRoutes);
router.use('/products', productsRoutes);
router.use('/users', usersRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/donations', donationRoutes);

module.exports = router;
