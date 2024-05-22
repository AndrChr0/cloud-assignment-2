import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

const CategoryPage = () => {
  const api = import.meta.env.VITE_URL;

  const { category_id } = useParams();
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [usernames, setUsernames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${api}/categories/${category_id}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchCategoryName = async () => {
      try {
        const response = await axios.get(`${api}/categories`);
        const category = response.data.find(cat => cat.category_id === parseInt(category_id));
        setCategoryName(category ? category.name : "Unknown Category");
      } catch (error) {
        console.error("Error fetching category name:", error);
      }
    };

    fetchPosts();
    fetchCategoryName();
  }, [category_id]);

  const fetchUsername = async (userId) => {
    if (usernames[userId]) return;

    try {
      const response = await axios.get(`${api}/users/${userId}`);
      setUsernames(prevUsernames => ({ ...prevUsernames, [userId]: response.data.username }));
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const userId = Number(localStorage.getItem("userID"));
      await axios.post(`${api}/posts/${postId}/like`, {
        user_id: userId,
      });

      setPosts(posts.map((post) =>
        post.post_id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleClickUser = (user)=>{
    navigate(`/profile/${user}`)

  }

  return (
    <>
      <div className="posts_in_category">
        <div className="backbutton" > <div onClick={() => navigate('/home')}><FaArrowLeftLong /> <span>Back</span> </div></div>
        <div className="background"></div>
        <h1 className="name"> <span>fr/{categoryName}</span></h1>
      </div>

      <div className="posts_container">
        {posts.length > 0 ? (
          posts.map((post) => {
            fetchUsername(post.user_id);

            return (
              <div className="post" key={post.post_id}>
                <div className="categoryAndDate">
                  <h4 className="categoryInFYP"> Posted by <span onClick={()=>handleClickUser(post.user_id)} className="postedByUser">fu/{usernames[post.user_id] || "Loading..."}</span> </h4>
                  <span>•</span>
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
          <p>Hello, there trendsetter!<br></br> Be the first one to post in fr/{categoryName}.</p>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
