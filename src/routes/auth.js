const router = require('express').Router();
const authenticate = require('../middlewares/authenticate');

const authController = require('../controllers/auth');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.get('/signout', authenticate.verifyUser, authController.signout);

module.exports = router;
