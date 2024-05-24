import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryList from "./CategoryList";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FYP = () => {
  const api = import.meta.env.VITE_URL;

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usernames, setUsernames] = useState({});

  const navigate = useNavigate();

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

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${api}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // Call the fetchPosts function when the component mounts
    fetchPosts();
    fetchCategories();

    // Set interval to fetch posts every 10 seconds
    const interval = setInterval(fetchPosts, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Handle the like button click
  const handleLike = async (postId) => {
    try {
      const userId = Number(localStorage.getItem("userID"));
      // Send a POST request to like the post
      await axios.post(`${api}/posts/${postId}/like`, {
        user_id: userId,
      });


      // Fetch posts again to get the updated likes from the server
      fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Function to get category name by ID
  const getCategoryNameById = (id) => {
    const category = categories.find((category) => category.category_id === id);
    return category ? category.name : "Unknown";
  };


  const fetchUsername = async (userId) => {
    if (usernames[userId]) return;

    try {
      const response = await axios.get(`${api}/users/${userId}`);
      setUsernames((prevUsernames) => ({
        ...prevUsernames,
        [userId]: response.data.username,
      }));
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const handleClickUser = (user) => {
    navigate(`/profile/${user}`);
  };
  return (
    <>
      <div className="posts_container">
        <CategoryList />

        {posts.length > 0 ? (
          posts.map((post) => {
            fetchUsername(post.user_id);
            return (
              <div className="post" key={post.post_id}>
                <div className="categoryAndDate">
                  <h4 className="categoryInFYP" onClick={()=>navigate(`/category/${post.category_id}`)}>
                    fr/{getCategoryNameById(post.category_id)}
                  </h4>
                  <span>•</span>
                  Posted by
                  <span className="postedByUser" onClick={() => handleClickUser(post.user_id)}>
                    fu/{usernames[post.user_id] || "Loading..."}
                  </span>
                  <small>{new Date(post.creation_date).toLocaleString()}</small>
                </div>

                <h2 className="title">{post.title}</h2>

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
            );
          })
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </>
  );
};

export default FYP;
