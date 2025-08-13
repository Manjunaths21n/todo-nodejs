const mongoose = require('mongoose');
const express = require('express');
const {router} = require('./routers/index.js');

const app = express();

app.use(express.json());

app.use('/api', require(router).router);

mongoose
    .connect(process.env.DB_URL, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB connected');

        app.listen(4000, () => { console.log('Server is running on port 4000'); });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
