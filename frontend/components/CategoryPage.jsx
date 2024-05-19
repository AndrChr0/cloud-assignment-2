import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryPage = () => {
  const { category_id } = useParams();
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/categories/${category_id}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const fetchCategoryName = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories');
        const category = response.data.find(cat => cat.category_id === parseInt(category_id));
        setCategoryName(category ? category.name : 'Unknown Category');
      } catch (error) {
        console.error('Error fetching category name:', error);
      }
    };

    fetchPosts();
    fetchCategoryName();
  }, [category_id]);

  return (
    <div>
      <h1>Posts in {categoryName}</h1>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post.post_id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <small>{new Date(post.creation_date).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default CategoryPage;