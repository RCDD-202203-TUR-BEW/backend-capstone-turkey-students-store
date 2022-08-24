const router = require('express').Router();

const usersRoutes = require('./users');
const productsRoutes = require('./products');
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const ordersRoutes = require('./orders');
const donationRoutes = require('./donations');

router.use('/profile', profileRoutes);
router.use('/products', productsRoutes);
router.use('/users', usersRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/orders', ordersRoutes);
router.use('/donations', donationRoutes);

module.exports = router;
