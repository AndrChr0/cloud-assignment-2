import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const userID = localStorage.getItem("userID");

    useEffect(() => {
        if (userID) {
            axios.get(`http://localhost:5000/users/${userID}`)
                .then(response => {
                    setUserDetails(response.data);
                })
                .catch(error => {
                    console.error("There was an error fetching the user details!", error);
                });
        }
    }, [userID]);

    if (!userDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <p>ID: {userDetails.user_id}</p>
            <p>Username: {userDetails.username}</p>
            <p>Email: {userDetails.email}</p>
        </div>
    );
};

export default Profile;


