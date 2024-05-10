import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get('http://localhost:8000/posts');
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  // Handle form submit to add a new post
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newPost = { title, description };
    await axios.post('http://localhost:8000/posts', newPost);
    setTitle('');
    setDescription('');
    // Reload the posts after adding
    const response = await axios.get('http://localhost:8000/posts');
    setPosts(response.data);
  };

  return (
    <div>
      <h1>Posts</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <button type="submit">Add Post</button>
      </form>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
