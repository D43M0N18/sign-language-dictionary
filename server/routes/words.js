const express = require('express');
const router = express.Router();
const Word = require('../models/Word');

// GET all words
router.get('/', async (req, res) => {
    try {
        console.log('Attempting to fetch all words...');
        const words = await Word.find();
        console.log(`Successfully fetched ${words.length} words`);
        res.json(words);
    } catch (error) {
        console.error('Error fetching words:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            message: 'Failed to fetch words',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// GET a single word
router.get('/:query', async (req, res) => {
    try {
        console.log(`Searching for word: ${req.params.query}`);
        const word = await Word.findOne({ word: req.params.query });
        if (!word) {
            console.log(`Word not found: ${req.params.query}`);
            return res.status(404).json({ message: "Word not found" });
        }
        console.log(`Found word: ${word.word}`);
        res.json(word);
    } catch (error) {
        console.error('Error finding word:', error);
        res.status(500).json({
            message: 'Failed to find word',
            error: error.message
        });
    }
});

// POST a new word
router.post('/', async (req, res) => {
    try {
        console.log('Attempting to create new word:', req.body);
        const { word, definition, imageUrl, videoUrl } = req.body;

        // Validation
        if (!word || !definition) {
            return res.status(400).json({
                message: 'Word and definition are required fields'
            });
        }

        // Check if word already exists
        const existingWord = await Word.findOne({ word: word });
        if (existingWord) {
            return res.status(409).json({
                message: 'Word already exists in the dictionary'
            });
        }

        const newWord = new Word({ word, definition, imageUrl, videoUrl });
        const savedWord = await newWord.save();
        console.log('Successfully created word:', savedWord.word);
        res.status(201).json(savedWord);
    } catch (error) {
        console.error('Error creating word:', error);
        console.error('Error stack:', error.stack);

        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                details: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Word already exists (duplicate key error)'
            });
        }

        res.status(500).json({
            message: 'Failed to create word',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// PUT (Update) a word by ID
router.put('/:id', async (req, res) => {
    try {
        console.log(`Updating word with ID: ${req.params.id}`);
        console.log('Update data:', req.body);

        const { word, definition, imageUrl, videoUrl } = req.body;

        // Validation
        if (!word || !definition) {
            return res.status(400).json({
                message: 'Word and definition are required fields'
            });
        }

        const updatedWord = await Word.findByIdAndUpdate(
            req.params.id,
            { word, definition, imageUrl, videoUrl },
            { new: true, runValidators: true } // runValidators ensures schema validation
        );

        if (!updatedWord) {
            console.log(`Word not found for ID: ${req.params.id}`);
            return res.status(404).json({ message: "Word not found" });
        }

        console.log('Successfully updated word:', updatedWord.word);
        res.json(updatedWord);
    } catch (error) {
        console.error('Error updating word:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid word ID format'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                details: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            message: 'Failed to update word',
            error: error.message
        });
    }
});

// DELETE a word by ID
router.delete('/:id', async (req, res) => {
    try {
        console.log(`Deleting word with ID: ${req.params.id}`);

        const deletedWord = await Word.findByIdAndDelete(req.params.id);
        if (!deletedWord) {
            console.log(`Word not found for deletion: ${req.params.id}`);
            return res.status(404).json({ message: "Word not found" });
        }

        console.log('Successfully deleted word:', deletedWord.word);
        res.json({
            message: "Word deleted successfully",
            deletedWord: deletedWord.word
        });
    } catch (error) {
        console.error('Error deleting word:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid word ID format'
            });
        }

        res.status(500).json({
            message: 'Failed to delete word',
            error: error.message
        });
    }
});

module.exports = router;
