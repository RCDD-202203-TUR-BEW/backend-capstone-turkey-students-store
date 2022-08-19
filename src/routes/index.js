const router = require('express').Router();

const usersRoutes = require('./users');
const authRoutes = require('./auth');
const productsRoutes = require('./products');
const profileRoutes = require('./profile');
const ordersRoutes = require('./orders');

router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/order', ordersRoutes);

module.exports = router;
