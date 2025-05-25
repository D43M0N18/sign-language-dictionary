const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// FIRST: Initialize the app
const app = express();

// THEN: Use middleware
app.use(cors());
app.use(express.json());

// THEN: Add routes
const wordsRouter = require('./routes/words');
app.use('/words', wordsRouter);

// THEN: Connect to database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// FINALLY: Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
