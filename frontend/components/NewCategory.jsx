import React, { useState } from 'react';
import axios from 'axios';

const NewCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://app:5000/categories', {
        name,
        description
      });
      setMessage(response.data.message);
      setName('');
      setDescription('');
    } catch (error) {
      setMessage('Error creating category');
      console.error('Error creating category:', error);
    }
  };

  return (
    <div>
      <h1>Create New Category</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Category</button>
      </form>
    </div>
  );
};

export default NewCategory;
