import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function Home() {
    const [words, setWords] = useState([]);
    const [search, setSearch] = useState('');
    const [editingWord, setEditingWord] = useState(null);
    const [editForm, setEditForm] = useState({
        word: '',
        definition: '',
        imageUrl: '',
        videoUrl: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchWords = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('http://localhost:5000/words');
            setWords(res.data);
        } catch (error) {
            console.error('Failed to fetch words', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWords();
    }, [fetchWords]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this sign?')) return;
        try {
            await axios.delete(`http://localhost:5000/words/${id}`);
            setWords(words.filter(word => word._id !== id));
        } catch (error) {
            console.error('Failed to delete word', error);
            alert('Failed to delete sign. Please try again.');
        }
    };

    const handleEdit = (word) => {
        setEditingWord(word._id);
        setEditForm({
            word: word.word,
            definition: word.definition,
            imageUrl: word.imageUrl,
            videoUrl: word.videoUrl
        });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/words/${editingWord}`, editForm);
            setWords(words.map(w => (w._id === editingWord ? response.data : w)));
            setEditingWord(null);
        } catch (error) {
            console.error('Failed to update word', error);
            alert('Failed to update sign. Please try again.');
        }
    };

    const handleCancelEdit = () => {
        setEditingWord(null);
    };

    const filtered = words.filter(w =>
        w.word.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading signs...</p>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="search-container">
                <input
                    type="text"
                    className="custom-search"
                    placeholder="Search signs..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="words-grid">
                {filtered.map(w => (
                    <div key={w._id} className="word-card">
                        {editingWord === w._id ? (
                            <form onSubmit={handleEditSubmit} className="edit-form">
                                <input
                                    className="form-input"
                                    name="word"
                                    value={editForm.word}
                                    onChange={handleEditChange}
                                    required
                                />
                                <textarea
                                    className="form-input"
                                    name="definition"
                                    value={editForm.definition}
                                    onChange={handleEditChange}
                                    required
                                    rows="3"
                                />
                                <input
                                    className="form-input"
                                    name="imageUrl"
                                    value={editForm.imageUrl}
                                    onChange={handleEditChange}
                                />
                                <input
                                    className="form-input"
                                    name="videoUrl"
                                    value={editForm.videoUrl}
                                    onChange={handleEditChange}
                                />
                                <div className="button-group">
                                    <button className="btn btn-success" type="submit">Save</button>
                                    <button className="btn btn-secondary" type="button" onClick={handleCancelEdit}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="word-content">
                                <h3 className="custom-word">{w.word}</h3>
                                <p className="custom-definition">{w.definition}</p>
                                {w.imageUrl && (
                                    <div className="image-container">
                                        <img src={w.imageUrl} alt={w.word} className="custom-img" />
                                    </div>
                                )}
                                <div className="button-group">
                                    {w.videoUrl && (
                                        <a href={w.videoUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                            Watch Video
                                        </a>
                                    )}
                                    <button className="btn btn-warning" onClick={() => handleEdit(w)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(w._id)}>Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
