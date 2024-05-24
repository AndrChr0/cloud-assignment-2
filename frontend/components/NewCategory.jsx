import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

const NewCategory = () => {
  const api = import.meta.env.VITE_URL;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send a POST request to the API endpoint with the category data
      const response = await axios.post(`${api}/categories`, {
        name,
        description
      });
      // Update the message state with the response data
      setMessage(response.data.message);
      // Reset the name and description states
      setName('');
      setDescription('');
      navigate('/home');
    } catch (error) {
      // Handle errors by setting an error message
      setMessage('Error creating category');
      console.error('Error creating category:', error);
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
    <div className='posts_container create'>
      <h1>Create New Category</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Name'
          />
        </div>
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder='Description'
          />
        </div>
        <button type="submit">Create Category</button>
      </form>
    </div>
    </>
  );
};

export default NewCategory;
