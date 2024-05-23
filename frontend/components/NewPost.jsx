import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";


const NewPost = () => {
  const api = import.meta.env.VITE_URL;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${api}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${api}/posts`, {
        title,
        content,
        category_id: category,
        user_id: Number(localStorage.getItem("userID")),
      });
      setMessage(response.data.message);
      setTitle("");
      setContent("");
      setCategory("");
      navigate("/home");
    } catch (error) {
      setMessage("Error creating post");
      console.error("Error creating post:", error);
    }
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
      <div className="posts_container create">
        <h1>Create New Post</h1>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ width: "30%", marginBottom: "15px" }}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Title"
              className="title"
            />
          </div>
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Text"
            />
          </div>
          <button type="submit">Create Post</button>
        </form>
      </div>
    </>
  );
};

export default NewPost;
