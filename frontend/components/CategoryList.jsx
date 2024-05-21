import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CategoryList = () => {

  const api = import.meta.env.VITE_URL;

  // Fetch categories from the API and update the state
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${api}/categories`);
        const categoriesData = response.data.map(category => ({
          category_id: category.category_id,
          name: category.name,
          description: category.description,
          creation_date: category.creation_date
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className='categorys'>
      <h2>Categories</h2>
      <ul>
        {categories.map(category => (
          <li key={category.category_id}>
            <Link to={`/category/${category.category_id}`}>fr/{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
