const User = require('../models/userModel');
const { Op } = require('sequelize');

exports.getAllUsers = async (req, res, next) => {
	try {
		const response = await User.findAll({
			where: { id: { [Op.ne]: req.user.id } },
		});
		res.status(200).json({ message: 'Success', response });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Bad request', error: err });
	}
};

exports.getUser = async (req, res, next) => {
	const userId = req.params.userId;
	try {
		const response = await User.findAll({ where: { id: userId } });
		res.send(200).json({ message: 'Success', response });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Bad request', error: err });
	}
};
