import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useReddit } from "../Context";
import { FaHeart } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

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
        localStorage.removeItem("user");
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
    <>
      <div style={{ width: "60%", margin: "0 auto" }}>
        <div className="backbutton">
          <div onClick={() => navigate("/home")}>
            <FaArrowLeftLong /> <span>Back</span>{" "}
          </div>
        </div>
      </div>

      <div className="posts_container create profile">
        <h1 style={{ fontWeight: "450" }}>
          fu/{capitalizeFirstLetter(userDetails.username)}
        </h1>

        {userId === localStorage.getItem("userID") && (
          <>
            <p>{userDetails.email}</p>
            <button onClick={handleDelete}>Delete User</button>
          </>
        )}
        <div className="userPostsInProfile">
          <h2>Posts</h2>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div className="post" key={post.post_id}>
                <div className="categoryAndDate">
                  <h4 className="categoryInFYP" onClick={()=>navigate(`/category/${post.category_id}`)}>
                    fr/{getCategoryNameById(post.category_id)}
                  </h4>
                  <span>•</span>

                  <small>{new Date(post.creation_date).toLocaleString()}</small>
                </div>

                <h3 className="title">{post.title}</h3>
                <p className="content">{post.content}</p>
              </div>
            ))
          ) : (
            <p>No posts made by this user.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
