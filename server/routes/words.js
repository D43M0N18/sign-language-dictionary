const express = require('express');
const router = express.Router();
const Word = require('../models/Word');

// GET all words
router.get('/', async (req, res) => {
    try {
        const words = await Word.find();
        res.json(words);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single word
router.get('/:query', async (req, res) => {
    try {
        const word = await Word.findOne({ word: req.params.query });
        if (!word) return res.status(404).json({ message: "Word not found" });
        res.json(word);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new word
router.post('/', async (req, res) => {
    try {
        const { word, definition, imageUrl, videoUrl } = req.body;
        const newWord = new Word({ word, definition, imageUrl, videoUrl });
        await newWord.save();
        res.status(201).json(newWord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT (Update) a word by ID
router.put('/:id', async (req, res) => {
    try {
        const { word, definition, imageUrl, videoUrl } = req.body;
        const updatedWord = await Word.findByIdAndUpdate(
            req.params.id,
            { word, definition, imageUrl, videoUrl },
            { new: true } // Return the updated word
        );
        if (!updatedWord) return res.status(404).json({ message: "Word not found" });
        res.json(updatedWord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a word by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedWord = await Word.findByIdAndDelete(req.params.id);
        if (!deletedWord) return res.status(404).json({ message: "Word not found" });
        res.json({ message: "Word deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
