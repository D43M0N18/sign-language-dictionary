const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema(
    {
        word: {
            type: String,
            required: [true, "Word is required"],
            trim: true,
            // unique: true, // Uncomment if you want each word to be unique
        },
        definition: {
            type: String,
            required: [true, "Definition is required"],
            trim: true,
        },
        imageUrl: {
            type: String,
            trim: true,
            default: "",
        },
        videoUrl: {
            type: String,
            trim: true,
            default: "",
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt fields automatically
    }
);

module.exports = mongoose.model('Word', wordSchema);
