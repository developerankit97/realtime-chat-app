const router = require('express').Router();

const { getAllUsers, getUser } = require('../controllers/userController');

const authentication = require('../middleware/authMiddleware');

router.get('/', authentication.authenticateUser, getAllUsers);

router.get('/:userId', authentication.authenticateUser, getUser);

module.exports = router;
