const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    word: String,
    definition: String,
    imageUrl: String,
    videoUrl: String
});

module.exports = mongoose.model('Word', wordSchema);
