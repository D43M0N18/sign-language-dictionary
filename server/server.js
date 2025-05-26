const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// FIRST: Initialize the app
const app = express();

// THEN: Use middleware
app.use(cors());
app.use(express.json());

// THEN: Add routes
const wordsRouter = require('./routes/words');
app.use('/words', wordsRouter);

// THEN: Connect to database
mongoose.connect('mongodb://localhost:27017/sign-language-dictionary', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// FINALLY: Start the server
const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
