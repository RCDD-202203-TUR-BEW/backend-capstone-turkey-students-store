const router = require('express').Router();

const usersRoutes = require('./users');
const productsRoutes = require('./products');
const authRoutes = require('./auth');

router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/auth', authRoutes);

module.exports = router;
