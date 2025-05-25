import React, { useState } from 'react';
import axios from 'axios';

function AddWordForm() {
    const [form, setForm] = useState({
        word: '', definition: '', imageUrl: '', videoUrl: ''
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        await axios.post('http://localhost:5000/words', form);
        setForm({ word: '', definition: '', imageUrl: '', videoUrl: '' });
        alert('Word added!');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="word" value={form.word} onChange={handleChange} placeholder="Word" required />
            <input name="definition" value={form.definition} onChange={handleChange} placeholder="Definition" required />
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL" />
            <input name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="Video URL" />
            <button type="submit">Add Word</button>
        </form>
    );
}

export default AddWordForm;
