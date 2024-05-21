import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryList from "./CategoryList";
import { FaHeart } from "react-icons/fa";

const FYP = () => {
  const api = import.meta.env.VITE_URL;

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${api}/categories`);
        setCategories(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // Fetch posts from the API
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${api}/posts`);
        // Initialize likes to 0 if undefined
        const postsData = response.data.map((post) => ({
          ...post,
          likes: post.likes || 0,
        }));
        // Update the posts state
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    // Call the fetchPosts function when the component mounts
    fetchPosts();
    fetchCategories();
  }, []);

  // Handle the like button click
  const handleLike = async (postId) => {
    try {
      const userId = Number(localStorage.getItem("userID"));
      // Send a POST request to like the post
      const response = await axios.post(`${api}/posts/${postId}/like`, {
        user_id: userId,
      });

      // Update the posts state to reflect the new like count
      setPosts(
        posts.map((post) =>
          post.post_id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Function to get category name by ID
  const getCategoryNameById = (id) => {
    const category = categories.find((category) => category.category_id === id);
    return category ? category.name : "Unknown";
  };
  return (
    <>
      <div className="posts_container">
        <CategoryList />

        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="post" key={post.post_id}>
              <div className="categoryAndDate">
                <h4 className="categoryInFYP">
                  fr/{getCategoryNameById(post.category_id)}
                </h4>
                <span>•</span>
                <small>{new Date(post.creation_date).toLocaleString()}</small>
              </div>

              <h2 className="title">{post.title}</h2>
              {/* <h4>{post.category_id}</h4> */}
              <p className="content">{post.content}</p>

              <div className="likes_container">
                <button
                  className="like"
                  onClick={() => handleLike(post.post_id)}
                >
                  <FaHeart />{" "}
                </button>
                <span className="like_count">Likes: {post.likes}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </>
  );
};

export default FYP;
