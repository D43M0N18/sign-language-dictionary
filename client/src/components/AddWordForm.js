import React, { useState } from 'react';
import axios from 'axios';

function AddWordForm({ onWordAdded }) {
    const [form, setForm] = useState({
        word: '',
        definition: '',
        imageUrl: '',
        videoUrl: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:5000/words', form);
            setForm({ word: '', definition: '', imageUrl: '', videoUrl: '' });
            if (onWordAdded) {
                onWordAdded(response.data);
            }
        } catch (error) {
            console.error('Error adding word:', error);
            alert('Failed to add word. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-word-container">
            <h2>Add New Sign</h2>
            <form onSubmit={handleSubmit} className="add-word-form">
                <div className="form-group">
                    <input
                        name="word"
                        value={form.word}
                        onChange={handleChange}
                        placeholder="Enter sign word"
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <textarea
                        name="definition"
                        value={form.definition}
                        onChange={handleChange}
                        placeholder="Enter definition"
                        required
                        className="form-input"
                        rows="3"
                    />
                </div>
                <div className="form-group">
                    <input
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleChange}
                        placeholder="Image URL (optional)"
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <input
                        name="videoUrl"
                        value={form.videoUrl}
                        onChange={handleChange}
                        placeholder="Video URL (optional)"
                        className="form-input"
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add Sign'}
                </button>
            </form>
        </div>
    );
}

export default AddWordForm;
