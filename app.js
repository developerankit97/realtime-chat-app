const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const sequelize = require('./utils/db');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('tiny'));

app.use('/auth', authRoutes);

sequelize
	.sync()
	.then()
	.catch((err) => console.log(err));

app.listen(process.env.PORT);
