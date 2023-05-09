const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const sequelize = require('./utils/db');
const socketio = require('socket.io');

const User = require('./models/userModel');
const Message = require('./models/messageModel');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('tiny'));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

User.hasMany(Message, { foreignKey: 'senderId' });
User.hasMany(Message, { foreignKey: 'receiverId' });

sequelize
	.sync()
	.then()
	.catch((err) => console.log(err));

const server = app.listen(process.env.PORT);

const io = socketio(server);

io.on('connection', (socket) => {
	console.log('A user connected', socket.id);

	socket.on('joinroom', (room) => {
		console.log(room);
		socket.join(room);
	});

	socket.on('chatMessage', (data) => {
		console.log(data.room);
		io.to(data.room).emit('chatMessage', data);
	});

	socket.on('typing', (data) => {
		console.log(data);
		io.to(data.room).emit('typing', data);
	});
});
