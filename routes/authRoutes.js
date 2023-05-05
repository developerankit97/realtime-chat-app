const router = require('express').Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.postSignUp);

router.post('/login', authController.postLogin);

module.exports = router;
