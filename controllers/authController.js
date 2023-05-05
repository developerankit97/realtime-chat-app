const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

exports.postSignUp = async (req, res, next) => {
	const { userDetails } = req.body;
	console.log(userDetails);

	try {
		const user = await User.findOne({
			where: {
				[Op.or]: [
					{ email: userDetails.email },
					{ phNo: userDetails.phNo },
				],
			},
		});
		if (user) {
			return res.status(400).json({ message: 'User already exists' });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(userDetails.password, salt);
		userDetails.password = hashedPassword;
		const userResponse = await User.create(userDetails);
		if (userResponse) {
			return res
				.status(200)
				.json({ message: 'User created successfully' });
		}
	} catch (err) {
		console.log(err, err.message);
		return res.status(500).json({ message: err.message });
	}
};

exports.postLogin = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	try {
		const user = await User.findOne({
			where: { email: email },
		});
		if (!user) {
			return res.status(400).json({ message: 'User not found' });
		}
		const isvalidPassword = await bcrypt.compare(password, user.password);
		if (!isvalidPassword) {
			return res.status(202).json({ message: 'Password is incorrect' });
		}
		const token = jwt.sign(
			{ id: user.id, name: user.name, email: user.email },
			process.env.JWT_SECRET
		);
		return res.status(200).json({
			message: 'login successful',
			token,
			name: user.name,
			email: user.email,
		});
	} catch (err) {
		console.log(err, err.message);
		res.status(500).json({ message: 'login failed' });
	}
};
