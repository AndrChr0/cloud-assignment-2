// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Register from "../components/Register";
// import { BrowserRouter as Routes, Route, Router } from "react-router-dom";
// import Login from "../components/Login";

// function App() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/")
//       .then((response) => {
//         setData(response.data.favorite_colors);
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the data!", error);
//       });
//   }, []);

//   return (
//     <>
//       <Router>
//         <Routes>
//           <Route path="/" element={<App />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Routes>
//       </Router>

//       <div>
//         <h1>Favorite Colors</h1>
//         <ul>
//           {data.map((item, index) => (
//             <li key={index}>
//               {Object.keys(item)[0]}: {Object.values(item)[0]}
//             </li>
//           ))}
//         </ul>

//         <Register />
//       </div>
//     </>
//   );
// }

// export default App;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "../components/Register";
import Login from "../components/Login";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then((response) => {
        setData(response.data.favorite_colors);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home data={data} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

const Home = ({ data }) => (
  <div>
    <h1>Favorite Colors</h1>
    <ul>
      {data.map((item, index) => (
        <li key={index}>
          {Object.keys(item)[0]}: {Object.values(item)[0]}
        </li>
      ))}
    </ul>
  </div>
);

export default App;
