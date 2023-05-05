const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.authenticateUser = async (req, res, next) => {
	try {
		const token = req.headers.authorization;
		const id = await jwt.verify(token, process.env.JWT_SECRET).id;
		if (id) {
			const user = await User.findOne({ where: { id: id } });
			if (!user) {
				return res.status(401).json({ message: 'User not found' });
			}
			req.user = user;
			next();
		} else {
			return res.status(401).json({ message: 'Token Not Valid' });
		}
	} catch (err) {
		return res.status(401).json({ message: 'User not found' });
	}
};
