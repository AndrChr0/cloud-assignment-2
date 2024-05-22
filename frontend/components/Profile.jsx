// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useReddit } from '../Context';

// const Profile = () => {
//   const api = import.meta.env.VITE_URL;

//     const [userDetails, setUserDetails] = useState(null);
//     const userID = localStorage.getItem("userID");
//     const navigate = useNavigate();

//     const { setIsLoggedIn, setUser } = useReddit();

//     useEffect(() => {
//         if (userID) {
//             axios.get(`${api}/users/${userID}`)
//                 .then(response => {
//                     setUserDetails(response.data);
//                 })
//                 .catch(error => {
//                     console.error("There was an error fetching the user details!", error);
//                 });
//         }
//     }, [userID]);

//     const handleDelete = () => {

//         if (!window.confirm("Are you sure you want to delete your account?")) {
//             return;
//         }


//         axios.delete(`${api}/users/${userID}`)
//             .then(response => {
//                 console.log(response.data.message);
//                 localStorage.removeItem("userID");
//                 setUserDetails(null); 
//                 setIsLoggedIn(false); 
//                 setUser(null); 
//                 navigate("/");
//             })
//             .catch(error => {
//                 console.error("There was an error deleting the user!", error);
//             });
//     };

//     if (!userDetails) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className='posts_container create profile'>
//             <h1>Profile</h1>
//             <p>Username: {userDetails.username}</p>
//             <p>Email: {userDetails.email}</p>
//             <button onClick={handleDelete}>Delete User</button>
//         </div>
//     );
// };

// export default Profile;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useReddit } from '../Context';

const Profile = () => {
  const api = import.meta.env.VITE_URL;
  const { userId } = useParams();  // Use useParams to get the userId from the URL
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  const { setIsLoggedIn, setUser } = useReddit();

  useEffect(() => {
    if (userId) {
      axios.get(`${api}/users/${userId}`)
        .then(response => {
            console.log(response.data)
          setUserDetails(response.data);
          console.log(response.data)
        })
        .catch(error => {
          console.error("There was an error fetching the user details!", error);
        });
    }
  }, [userId]);

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete your account?")) {
      return;
    }

    axios.delete(`${api}/users/${userId}`)
      .then(response => {
        console.log(response.data.message);
        localStorage.removeItem("userID");
        setUserDetails(null);
        setIsLoggedIn(false);
        setUser(null);
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
    <div className='posts_container create profile'>
      <h1>Profile</h1>
      <p>Username: {userDetails.username}</p>
      <p>Email: {userDetails.email}</p>
      {userId === localStorage.getItem("userID") && (
        <button onClick={handleDelete}>Delete User</button>
      )}
    </div>
  );
};

export default Profile;

