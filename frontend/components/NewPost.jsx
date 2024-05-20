import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewPost = () => {
  const api = import.meta.env.VITE_URL;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${api}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();



    try {
      const response = await axios.post(`${api}/posts`, {
        title,
        content,
        category_id: category,
        user_id: Number(localStorage.getItem("userID"))
      });
      setMessage(response.data.message);
      setTitle('');
      setContent('');
      setCategory('');
    } catch (error) {
      setMessage('Error creating post');
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <h1>Create New Post</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default NewPost;
