const Sequelize = require('sequelize');

const sequelize = require('../utils/db');

const Message = sequelize.define('messages', {
	id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
	},
	message: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

module.exports = Message;
