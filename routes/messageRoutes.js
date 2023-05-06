const router = require('express').Router();

const messageController = require('../controllers/messageController');

const authentication = require('../middleware/authMiddleware');

router.get(
	'/:receiverId',
	authentication.authenticateUser,
	messageController.getMessages
);

router.post(
	'/',
	authentication.authenticateUser,
	messageController.postMessage
);

module.exports = router;
