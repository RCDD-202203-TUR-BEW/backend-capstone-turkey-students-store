const router = require('express').Router();

const usersRoutes = require('./users');
const authRoutes = require('./auth');
const productsRoutes = require('./products');

router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/auth', authRoutes);

module.exports = router;
