import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useReddit } from '../Context';

const Profile = () => {
  const api = import.meta.env.VITE_URL;

    const [userDetails, setUserDetails] = useState(null);
    const userID = localStorage.getItem("userID");
    const navigate = useNavigate();

    const { setIsLoggedIn, setUser } = useReddit();

    useEffect(() => {
        if (userID) {
            axios.get(`${api}/users/${userID}`)
                .then(response => {
                    setUserDetails(response.data);
                })
                .catch(error => {
                    console.error("There was an error fetching the user details!", error);
                });
        }
    }, [userID]);

    const handleDelete = () => {

        if (!window.confirm("Are you sure you want to delete your account?")) {
            return;
        }


        axios.delete(`${api}/users/${userID}`)
            .then(response => {
                console.log(response.data.message);
                localStorage.removeItem("userID");
                setUserDetails(null); // Clear user details on successful deletion
                setIsLoggedIn(false); // Log out the user on successful deletion
                setUser(null); // Clear user details from context on successful deletion
                navigate("/");
            })
            .catch(error => {
                console.error("There was an error deleting the user!", error);
            });
    };

    if (!userDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <p>Username: {userDetails.username}</p>
            <p>Email: {userDetails.email}</p>
            <button onClick={handleDelete}>Delete User</button>
        </div>
    );
};

export default Profile;
