import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryList from "./CategoryList";

const FYP = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts");
        setPosts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <CategoryList />

      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.creation_date}>
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

export default FYP;
