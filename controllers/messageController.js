const User = require('../models/userModel');
const Message = require('../models/messageModel');

exports.postMessage = async (req, res, next) => {
	const message = req.body.message;
	const receiverId = Number(req.body.receiverId);
	try {
		const response = await Message.create({
			message: message,
			receiverId: receiverId,
			senderId: req.user.id,
		});
		res.status(200).json({
			message: 'message created successfully',
			response: response,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Error', error: err });
	}
};

exports.getMessages = async (req, res, next) => {
	const receiverId = Number(req.params.receiverId);
	try {
		const response = await Message.findAll({
			where: { senderId: req.user.id, receiverId: receiverId },
		});
		res.status(200).json({
			message: 'Success',
			response: response,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Error', error: err });
	}
};
