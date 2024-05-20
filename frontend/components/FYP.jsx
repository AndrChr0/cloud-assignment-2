import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryList from "./CategoryList";

const FYP = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts");
        const postsData = response.data.map(post => ({
          ...post,
          likes: post.likes || 0  // Ensure likes is initialized to 0 if undefined
        }));
        setPosts(postsData);
        console.log(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const userId = Number(localStorage.getItem("userID"));
      const response = await axios.post(`/api/posts/${postId}/like`, { user_id: userId });
      console.log(response.data);
      
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
      <h1>Home</h1>
      <CategoryList />

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

export default FYP;
