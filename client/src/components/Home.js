import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        fetchWords();
    }, []);

    const fetchWords = async () => {
        try {
            const res = await axios.get('http://localhost:5000/words');
            setWords(res.data);
        } catch (error) {
            console.error('Failed to fetch words', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this word?')) return;
        try {
            await axios.delete(`http://localhost:5000/words/${id}`);
            setWords(words.filter(word => word._id !== id));
        } catch (error) {
            console.error('Failed to delete word', error);
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
            await axios.put(`http://localhost:5000/words/${editingWord}`, editForm);
            setWords(words.map(w => (w._id === editingWord ? { ...w, ...editForm } : w)));
            setEditingWord(null);
        } catch (error) {
            console.error('Failed to update word', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingWord(null);
    };

    const filtered = words.filter(w =>
        w.word.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container my-4">
            <input
                type="text"
                className="form-control mb-3 custom-search"
                placeholder="Search words..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <div className="row">
                {filtered.map(w => (
                    <div key={w._id} className="col-12 col-md-6 col-lg-4 mb-4">
                        <div className="card custom-card h-100">
                            <div className="card-body">
                                {editingWord === w._id ? (
                                    <form onSubmit={handleEditSubmit}>
                                        <input
                                            className="form-control mb-2"
                                            name="word"
                                            value={editForm.word}
                                            onChange={handleEditChange}
                                            required
                                        />
                                        <input
                                            className="form-control mb-2"
                                            name="definition"
                                            value={editForm.definition}
                                            onChange={handleEditChange}
                                            required
                                        />
                                        <input
                                            className="form-control mb-2"
                                            name="imageUrl"
                                            value={editForm.imageUrl}
                                            onChange={handleEditChange}
                                        />
                                        <input
                                            className="form-control mb-2"
                                            name="videoUrl"
                                            value={editForm.videoUrl}
                                            onChange={handleEditChange}
                                        />
                                        <button className="btn btn-success btn-sm me-2" type="submit">Save</button>
                                        <button className="btn btn-secondary btn-sm" type="button" onClick={handleCancelEdit}>Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        <h5 className="card-title custom-word">{w.word}</h5>
                                        <p className="card-text custom-definition">{w.definition}</p>
                                        {w.imageUrl && (
                                            <img src={w.imageUrl} alt={w.word} className="img-fluid mb-2 custom-img" />
                                        )}
                                        <div>
                                            {w.videoUrl && (
                                                <a href={w.videoUrl} className="btn btn-primary btn-sm me-2" target="_blank" rel="noopener noreferrer">
                                                    Video
                                                </a>
                                            )}
                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(w)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(w._id)}>Delete</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
