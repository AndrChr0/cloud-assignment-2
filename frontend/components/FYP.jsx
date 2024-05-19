import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FYP = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            <h1>For You Page</h1>
            {posts.length > 0 ? (
                posts.map(post => (
                    <div key={post[0]}>
                        <h2>{post[1]}</h2>
                        <p>{post[2]}</p>
                        <small>{new Date(post[3]).toLocaleString()}</small>
                    </div>
                ))
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
};

export default FYP;
