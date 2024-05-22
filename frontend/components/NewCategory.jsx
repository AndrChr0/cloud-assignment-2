import React, { useState } from 'react';
import axios from 'axios';

const NewCategory = () => {
  const api = import.meta.env.VITE_URL;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send a POST request to the API endpoint with the category data
      const response = await axios.post(`${api}/categories`, {
        name,
        description
      });
      // Update the message state with the response data
      setMessage(response.data.message);
      // Reset the name and description states
      setName('');
      setDescription('');
    } catch (error) {
      // Handle errors by setting an error message
      setMessage('Error creating category');
      console.error('Error creating category:', error);
    }
  };

  return (
    <div className='posts_container create'>
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
