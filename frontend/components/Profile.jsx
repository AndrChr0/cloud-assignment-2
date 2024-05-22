import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useReddit } from "../Context";

const Profile = () => {
  const api = import.meta.env.VITE_URL;
  const { userId } = useParams(); // Use useParams to get the userId from the URL
  const [userDetails, setUserDetails] = useState(null);
  const [userPosts, setUserPosts] = useState([]); // State for user posts
  const [categories, setCategories] = useState([]); // State for categories
  const navigate = useNavigate();

  const { setIsLoggedIn, setUser } = useReddit();

  useEffect(() => {
    if (userId) {
      axios
        .get(`${api}/users/${userId}`)
        .then((response) => {
          setUserDetails(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the user details!", error);
        });

      // Fetch posts made by the user
      axios
        .get(`${api}/users/${userId}/posts`)
        .then((response) => {
          console.log("Posts response:", response.data); 
          setUserPosts(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the user posts!", error);
        });

      // Fetch categories
      axios
        .get(`${api}/categories`)
        .then((response) => {
          setCategories(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching categories!", error);
        });
    }
  }, [userId]);

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete your account?")) {
      return;
    }

    axios
      .delete(`${api}/users/${userId}`)
      .then((response) => {
        console.log(response.data.message);
        localStorage.removeItem("userID");
        setUserDetails(null);
        setIsLoggedIn(false);
        setUser(null);
        navigate("/");
      })
      .catch((error) => {
        console.error("There was an error deleting the user!", error);
      });
  };

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getCategoryNameById = (id) => {
    const category = categories.find((category) => category.category_id === id);
    return category ? category.name : "Unknown";
  };

  return (
    <div className="posts_container create profile">
      <h1 style={{ fontWeight: "450" }}>
        fu/{capitalizeFirstLetter(userDetails.username)}
      </h1>
      <p>{userDetails.email}</p>
      {userId === localStorage.getItem("userID") && (
        <button onClick={handleDelete}>Delete User</button>
      )}
      <h2>User Posts</h2>
      {userPosts.length > 0 ? (
        userPosts.map((post) => (
          <div className="post" key={post.post_id}>
            <h4 className="categoryInFYP">
              fr/{getCategoryNameById(post.category_id)}
            </h4>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>{new Date(post.creation_date).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p>No posts made by this user.</p>
      )}
    </div>
  );
};

export default Profile;

