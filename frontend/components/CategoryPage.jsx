import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryPage = () => {
  const api = import.meta.env.VITE_URL;

  const { category_id } = useParams();
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    // Fetch posts for the selected category
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${api}/categories/${category_id}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    // Fetch the name of the selected category
    const fetchCategoryName = async () => {
      try {
        const response = await axios.get(`${api}/categories`);
        const category = response.data.find(cat => cat.category_id === parseInt(category_id));
        setCategoryName(category ? category.name : 'Unknown Category');
      } catch (error) {
        console.error('Error fetching category name:', error);
      }
    };

    // Call the fetch functions when the category_id changes
    fetchPosts();
    fetchCategoryName();
  }, [category_id]);

  const handleLike = async (postId) => {
    try {
      const userId = Number(localStorage.getItem("userID"));
      const response = await axios.post(`${api}/posts/${postId}/like`, { user_id: userId });
      
      // Update the posts state to reflect the new like count
      setPosts(posts.map(post =>
        post.post_id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div>
      <h1>Posts in {categoryName}</h1>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post.post_id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <small>{new Date(post.creation_date).toLocaleString()}</small>
            <p>Likes: {post.likes}</p>
            <button onClick={() => handleLike(post.post_id)}>Like</button>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default CategoryPage;
