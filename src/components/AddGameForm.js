import React, { useState } from 'react';
import './AddGameForm.css';

function AddGameForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    players: '',
    time: '',
    complexity: 'Easy',
    addedBy: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.addedBy) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
    setFormData({
      title: '',
      image: '',
      players: '',
      time: '',
      complexity: 'Easy',
      addedBy: ''
    });
  };

  return (
    <form className="add-game-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Image URL</label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Number of Players</label>
        <input
          type="text"
          name="players"
          value={formData.players}
          onChange={handleChange}
          placeholder="e.g., 2-4"
        />
      </div>

      <div className="form-group">
        <label>Play Time (minutes)</label>
        <input
          type="text"
          name="time"
          value={formData.time}
          onChange={handleChange}
          placeholder="e.g., 30-60"
        />
      </div>

      <div className="form-group">
        <label>Complexity</label>
        <select name="complexity" value={formData.complexity} onChange={handleChange}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div className="form-group">
        <label>Your Name *</label>
        <input
          type="text"
          name="addedBy"
          value={formData.addedBy}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="submit-button">Add Game</button>
    </form>
  );
}

export default AddGameForm;

