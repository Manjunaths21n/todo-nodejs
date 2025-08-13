require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { todoRouters } = require('./routers/index.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', todoRouters);

mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log('MongoDB connected');

        app.listen(4000, () => { console.log('Server is running on port 4000'); });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
