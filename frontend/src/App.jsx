import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(response => {
        setData(response.data.favorite_colors);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <div>
      <h1>Favorite Colors</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{Object.keys(item)[0]}: {Object.values(item)[0]}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
